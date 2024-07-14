const Router = require("express");
const router = new Router();
const controller = require("./controller");

const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session')

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: `${process.env.APP_URL}/api/auth/google/callback` // THIS FUNCTIONS RUNS AFTER COMPLETION OF AUTHENTICATION (AFTER FUNCTION)
},
    function (accessToken, refreshToken, profile, cb) { // this function invoked is authorization is successfull
        console.log(profile)
        if (true) console.log('user exists')
        else console.log('user does not exist');
        // User.findOrCreate({ googleId: profile.id }, function (err, user) {
        //     return cb(err, user);
        // });
        return profile
    }
));



// Auth
router.get("/google", passport.authenticate('google', { scope: ['profile'] }));



router.get("/google/callback",
    passport.authenticate('google', { failureRedirect: '/' }, // this line happens if failure
        controller.authCallback)
);


module.exports = router;