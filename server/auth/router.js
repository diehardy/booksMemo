const Router = require("express");
const router = new Router();
const controller = require("./controller");

const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session')

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: `${process.env.APP_URL}/api/auth/google/callback` // THIS RUNS AFTER COMPLETION OF AUTHENTICATION (AFTER FUNCTION)
},
    function (accessToken, refreshToken, profile, cb) { // this function invoked is authorization is successfull

        if (profile.id) {
            const user = controller.authorizeUser(profile.id, profile.displayName, profile.emails[0].value, profile.photos[0].value)
        } else {
            console.log('google user does not exist.')
        }
    }
));



// Auth
router.get("/google", passport.authenticate('google', { scope: ['profile', 'email'] })); // start auth



router.get("/google/callback",
    (req, res) => {
        console.log('successful login')
        res.redirect('http://localhost:8080/books')
    }
);



router.get("/profile", (req, res) => {
    req.send('<h1>try this</h1>')
}

);


module.exports = router;