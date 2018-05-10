const express = require('express');
const router = new express.Router();
const User = require('../models/User');

router.post('/emoji', (req, res) => {
  const emoji = req.body.emoji;
  User.findById(req.user._id, (err, user) => {
    if (err) return res.status(500).send();
    user.emoji = emoji;
    user.save((err, user) => {
      if (err) return res.status(500).send();
      res.status(201).send(user);
    });
  });
});

router.get('/', (req, res) => {
  User.findById(req.user._id, (err, user) => {
    if (err) return res.status(500).send();
    res.status(200).send(user);
  });
});

module.exports = router;
