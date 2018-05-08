const express = require('express');
const router = new express.Router();
const strategyFacebook = require('../strategies/facebook');

router.get('/login', (req, res) => {
  res.render('login', {title: 'Log in to Radal'});
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/authenticate/login');
});

router.get('/', strategyFacebook.authenticate('facebook'));

router.get('/authcallback',
    strategyFacebook.authenticate('facebook', {
      successRedirect: '/',
      failureRedirect: '/authenticate',
    }));

module.exports = router;
