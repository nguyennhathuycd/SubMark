const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const keys = require('../config/googleKey/key');

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(
  new GoogleStrategy({
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: 'https://supmark.herokuapp.com/authGoogle/callback',
    },
     function (accessToken, refreshToken, profile, done) {
       return done(null, profile);
    })
);