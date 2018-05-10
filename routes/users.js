const express = require('express');
const router = new express.Router();

router.post('/', (req, res) => {
  const emoji = req.body.emoji;
  if (emoji) {
    console.log(emoji);
    res.end('OK');
  }
});

module.exports = router;
