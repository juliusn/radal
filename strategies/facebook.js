const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(null, user);
  });
});

passport.use(new FacebookStrategy({
  clientID: '152386338928593',
  clientSecret: 'a4d1622d812f37109a2b980596a135bb',
  callbackURL: 'https://localhost:8443/authenticate/authcallback',
}, (accessToken, refreshToken, profile, done) => {
  const query = {userid: profile.id};
  const doc = {
    name: profile.displayName,
    userid: profile.id,
  };

  User.findOneOrCreate(query, doc, (err, user) => {
    if (err) return done(err);
    console.log(user.isNew ? 'New user created' : 'Existing user found',
        user);
    done(null, user);
  });
}));

module.exports = passport;
