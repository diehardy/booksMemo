
const express = require("express");
const PORT = 8000;
require("dotenv").config();
const router = require("./mvc/router")
const authRouter = require("./auth/router")

// cors
const cors = require("cors");
let corsOptions = {
    origin: "http://147.45.246.190/:8080",
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
};

const app = express();
const passport = require('passport')
const session = require('express-session')



app.use(cors(corsOptions)); // middleware for cors
app.use(express.json());    // middleware for json

// cookie
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: 60000 * 60 * 24 }
}))

// initialize passport
app.use(passport.initialize())
app.use(passport.session())


// routers
app.use('/api/books/', router)

app.use('/api/auth/', authRouter)

// start
const start = async () => {
    try {
        app.listen
            (
                PORT,
                () => console.log(`server started on port ${PORT}`)
            );
    } catch (e) {
        console.log(e);
    }
};

start();

