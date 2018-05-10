const express = require('express');
const router = new express.Router();
const User = require('../models/User');
const Geotag = require('../models/Geotag');

router.post('/emoji', (req, res) => {
  console.log(req.body);
  const emoji = req.body.emoji;
  User.findById(req.user._id, (err, user) => {
    if (err) return res.status(500).send(err);
    user.emoji = emoji;
    user.save((err, user) => {
      if (err) return res.status(500).send(err);
      res.status(201).send(user);
    });
  });
});

router.post('/geotag', (req, res) => {
  console.log(req.body);
  const geotag = new Geotag(req.body);
  geotag.creator = req.user._id;
  geotag.save((err) => {
    if (err) return res.status(500).send(err);
    res.status(201).send(geotag);
  });
});

router.get('/', (req, res) => {
  User.findById(req.user._id, (err, user) => {
    if (err) return res.status(500).send();
    res.status(200).send(user);
  });
});

module.exports = router;
