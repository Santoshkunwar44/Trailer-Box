module.exports = {
    isAuthenticated: function (req, res) {

        console.log(req.session?.passport?.user)
        console.log(req.user)
        console.log(req.isAuthenticated())

        if (req.isAuthenticated()) {
            next()
        } else {
            res.send({ success: false })
        }
    }
}