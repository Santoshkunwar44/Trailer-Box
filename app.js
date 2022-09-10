
const express = require("express")
const dotenv = require("dotenv")
const app = express()
dotenv.config({ path: "./config/config.env" })
const cookieParser = require("cookie-parser")
const morgan = require("morgan")
const passport = require("passport")
const session = require("express-session")
const MongoStore = require("connect-mongo")
const cors = require("cors")



const mongoDb = require("./config/database")
// importing the routes 

const authRoute = require("./routes/auth")
const userRoute = require("./routes/user")

const IS_PRODUCTION = process.env.NODE_ENV === 'production'


mongoDb()
//  middlewares  
app.use(morgan("dev"))
// app.use(cookieParser())
app.use(cookieParser())
require("./config/passport")(passport)
app.use(session({
    name: "trailerBox.sid",
    secret: "pussycat",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 2, httpOnly: true, secure: IS_PRODUCTION, sameSite: "none" },
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        autoRemove: 'native',
        ttl: 1000 * 60 * 60 * 24 * 2,
        collectionName: "trailer_userSession"
    })
}))






// HANLDEBARS 
app.use(passport.initialize())
app.use(passport.session())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}
))



// routes 
app.use("/api/auth", authRoute)
app.use("/api/user", userRoute)


// load config

const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`Server running in  at port ${PORT}`))
