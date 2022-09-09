const mongoose = require("mongoose")

const sesionUser = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    authId: {
        type: String,
    }
})

module.exports = mongoose.model("sessionuser", sesionUser);