
const router = require("express").Router()



router.put("/session", (req, res) => {
    const userSession = req.session.user
    if (userSession) {
        req.session.user = {
            userCredentials: { ...req.session.user.userCredentials, new: false }
        }
    }
    res.status(200).json({ message: "successfully updated session", success: true })

})

// logout 
router.get("/logout", async (req, res) => {

    req.session.destroy((err) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ message: err, success: false })
        }
    })


    return res.status(200).json({ message: "successfully loggedOut", success: true })

})

module.exports = router