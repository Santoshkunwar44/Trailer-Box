const mongoose = require("mongoose")

const connectToMongo = async () => {
    try {


        const connect = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log(`Database connected ${connect.connection.host}`)

    } catch (err) {

        console.log(err)
        process.exit(1)
    }


}

module.exports = connectToMongo