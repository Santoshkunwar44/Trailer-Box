
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const sessionUser = require("../model/sessionUser")

module.exports = function (passport) {

    passport.use(new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback"
        },
        async (accessToken, refreshToken, profile, done) => {

            const newUser = {
                username: profile.displayName,
                email: profile._json.email,
                image: profile._json.picture,
                authId: profile.id
            };

            done(null, newUser)


        }))

    // serializing the user // taking  the userId and putting it to the cookie which uniquely indentifies the request ( which user is requesting ) and identifies the user through the id 
    // req.session.cookie.user = (key || the unique id of the user )
    passport.serializeUser(function (user, done) {

        // console.log("inside the serialzed ******************************************************************************** :", user)
        done(null, user);
    });



    //  desirializing  the user means asking for all the user credentails through the userid and putting it to the req.user object 
    // req.user ={ all the user credentails } is obtained through it
    passport.deserializeUser(function (user, done) {
        done(null, user);
    });

}

