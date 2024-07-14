const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session')

const express = require("express");
const PORT = 8000;
require("dotenv").config();
const router = require("./mvc/router")
const authRouter = require("./auth/router")

// cors
const cors = require("cors");
let corsOptions = {
    origin: "http://localhost:8080",
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
};

const app = express();


// passport


// passport.use(new GoogleStrategy({
//     clientID: GOOGLE_CLIENT_ID,
//     clientSecret: GOOGLE_CLIENT_SECRET,
//     callbackURL: "http://www.example.com/auth/google/callback"
// },
//     function (accessToken, refreshToken, profile, cb) {
//         User.findOrCreate({ googleId: profile.id }, function (err, user) {
//             return cb(err, user);
//         });
//     }
// ));








app.use(cors(corsOptions)); // middleware for cors
app.use(express.json());    // middleware for json

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

