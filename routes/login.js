const express = require('express');
const router = new express.Router();

router.get('/', (req, res) => {
  res.render('login', {env: res.env});
});

module.exports = router;
