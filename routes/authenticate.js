const express = require('express');
const router = new express.Router();
const strategyFacebook = require('../strategies/facebook');

router.get('/login', (req, res) => {
  res.render('login', {title: 'You need to log in with Facebook in order to use this service.'});
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/authenticate/login');
  });
});

router.get('/', strategyFacebook.authenticate('facebook'));

router.get('/authcallback',
    strategyFacebook.authenticate('facebook', {
      successRedirect: '/',
      failureRedirect: '/authenticate',
    }));

module.exports = router;
