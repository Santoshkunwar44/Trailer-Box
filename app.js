
const express = require("express")
const dotenv = require("dotenv")
const app = express()
dotenv.config({ path: "./config/config.env" })
const morgan = require("morgan")
const passport = require("passport")
const session = require("express-session")
const MongoStore = require("connect-mongo")
const cors = require("cors")



const mongoDb = require("./config/database")
// importing the routes 

const authRoute = require("./routes/auth")
const userRoute = require("./routes/user")


mongoDb()
//  middlewares  
app.use(morgan("dev"))
// app.use(cookieParser())
require("./config/passport")(passport)
app.use(session({
    secret: process.env.session_secret,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 2, httpOnly: true },
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

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running in  at port ${PORT}`))
