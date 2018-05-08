const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');

passport.use(new FacebookStrategy({
  clientID: '152386338928593',
  clientSecret: 'a4d1622d812f37109a2b980596a135bb',
  callbackURL: '/',
}, (accessToken, refreshToken, profile, done) => {
  const query = {userId: profile.id};
  const doc = {
    name: profile.displayName,
    userId: profile.id,
  };
  User.findOrCreate(query, doc, (err, user) => {
    if (err) return done(err);
    console.log(user.isNew ? 'New user created' : 'Existing user found', user);
    done(null, user);
  });
}));

module.exports = passport;
