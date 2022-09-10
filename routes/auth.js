const passport = require("passport")
const userModel = require("../model/users")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const router = require("express").Router()


router.get("/login/success", (req, res) => {

    console.log("the passport session : ", req.user)

    if (!req.user && !req.session.user) {
        req.session.user = {
            userCredentials: { lastLoggedInAt: new Date().getTime(), new: true }
        }
        return res.status(200).json({ message: { ...req.session.user.userCredentials }, success: true })
    }
    if (req.user) {
        if (req.session.user) {
            return res.status(200).json({ message: { ...req.session.user?.userCredentials, lastLoggedInAt: new Date().getTime(), loginMethod: "google" } })
        } else {

            req.session.user = {
                userCredentials: { ...req.user, lastLoggedInAt: new Date().getTime(), loginMethod: "google", new: true },
            }
            return res.status(200).json({ message: { ...req.session.user?.userCredentials }, success: true })
        }

    } else {
        if (req.session.user) {
            return res.json({ message: req.session.user.userCredentials, success: true })
        } else {
            res.json({ message: "session empty ", success: false })
        }
    }


})




router.get('/google',
    passport.authenticate('google', { scope: ['profile', "email"] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: 'http://localhost:3000/' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('http://localhost:3000/');
    });




// login        


router.post("/login", async (req, res) => {

    const { email, password: userPassword } = req.body

    if (!email || !userPassword) return res.status(422).json({ message: "Fill all the credentails", success: false })
    try {
        const user = await userModel.findOne({ email })

        if (user) {

            let validPassword = await bcrypt.compare(userPassword, user.password)


            if (validPassword) {
                const { password, ...others } = user._doc;
                const token = await jwt.sign({ id: user._id }, process.env.jwt_secret, {
                    expiresIn: "1day"
                })
                req.session.user = {
                    userCredentials: { ...others, loginMethod: "app" }
                }
                return res.status(200).json({ message: { ...req.session.user.userCredentials, token, new: true }, success: true })

            } else {
                return res.status(422).json({ message: "Invalid  credentails", success: false })

            }




        } else {
            res.status(422).json({ message: "Invalid Credentials", success: false })
        }
    } catch (err) {

        res.status(500).json({ message: err.message, success: false })
    }
})



router.post("/register", async (req, res) => {
    const { password: userpassword } = req.body
    if (!userpassword) {
        return res.status(422).json({ message: "fill all the fields", success: false })
    }
    try {
        const salt = await bcrypt.genSalt(10)
        const hashed = await bcrypt.hash(userpassword, salt)
        req.body.password = hashed
        const savedUser = await userModel.create(req.body);
        const token = await jwt.sign({ id: savedUser._id }, process.env.jwt_secret, {
            expiresIn: "1day"
        })
        const { password, ...others } = savedUser._doc;
        req.session.user = {
            userCredentials: { ...others, loginMethod: "app" }
        }
        return res.status(200).json({ message: { ...req.session.user.userCredentials, token, new: true }, success: true })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message, success: false })
    }
})

module.exports = router