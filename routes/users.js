const express = require('express');
const router = new express.Router();
const User = require('../models/User');
const Geotag = require('../models/Geotag');

router.post('/emoji', (req, res) => {
  const emoji = req.body.emoji;
  User.findById(req.user._id, (err, user) => {
    if (err) return res.status(500).send(err);
    user.emoji = emoji;
    user.updated_at = Date.now();
    user.save((err, user) => {
      if (err) return res.status(500).send(err);
      res.status(201).send(user);
    });
  });
});

router.post('/geotag', (req, res) => {
  const geotag = new Geotag(req.body);
  geotag.creator = req.user._id;
  geotag.save((err) => {
    if (err) return res.status(500).send(err);
    res.status(201).send(geotag);
  });
});

router.post('/location', (req, res) => {
  User.findById(req.user._id, (err, user) => {
    if (err) return res.status(500).send(err);
    user.location = [req.body.lat, req.body.lng];
    user.updated_at = Date.now();
    user.save((err, user) => {
      if (err) return res.status(500).send(err);
      res.status(201).send(user);
    });
  });
});

router.get('/activeusers', (req, res) => {
  let limit = new Date();
  limit.setMinutes(limit.getMinutes() - 5);
  User.find({
    updated_at: {'$gte': limit},
  }, (err, users) => {
    if (err) console.log(err);
    if (err) return res.status(500).send(err);
    res.status(200).send(users);
  });
});

router.get('/', (req, res) => {
  User.findById(req.user._id, (err, user) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(user);
  });
});

module.exports = router;
