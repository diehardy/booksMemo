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
    async function (accessToken, refreshToken, profile, cb) { // this function invoked is authorization is successfull

        try {
            if (profile.id) {
                const user = await controller.authorizeUser(profile.id, profile.displayName, profile.emails[0].value, profile.photos[0].value)
                return cb(null, user)
            } else {
                throw new Error('google user does not exist.')
            }
        }
        catch (err) {
            return cb(err, null)
        }
    }
));

// serialize user into the session
passport.serializeUser((user, done) => {
    console.log(`Initial serialize user:`);
    console.log(user);

    done(null, user.id)
})


// deserialize user from the session


passport.deserializeUser((id, done) => {
    try {
        console.log(`deserialize user id:`);
        console.log(id);
        const user = controller.findUser(id)
        if (!user[0]) throw new Error('User not found')
        done(null, user) // im not sure credentials are match passport
    }
    catch (err) {
        done(null, id)
    }
})







// Auth
router.get("/google", passport.authenticate('google', { scope: ['profile', 'email'] })); // start auth



router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        console.log(req)
        console.log(req.session) // here is id of user
        res.redirect('/books');
    }
);






module.exports = router;