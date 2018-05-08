const express = require('express');
const router = new express.Router();
const authguard = require('../middleware/authguard');

router.get('/', authguard, (req, res) => {
  res.render('map', {user: req.user});
});

module.exports = router;
