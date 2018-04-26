const dotenv = require('dotenv');
const express = require('express');
const logger = require('morgan');
const http = require('http');
const app = express();
const mongoose = require('mongoose');
const result = dotenv.config();
if (result.error) throw result.error;

app.use(logger('dev'));

app.enable('trust proxy');

app.use((req, res, next) => {
  if (req.secure) {
    next();
  } else {
    res.redirect('https://' + req.headers.host + req.url);
  }
});

app.get('/', (req, res) => {
  res.send('works');
});

mongoose.connect(
    `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/radal`).
    then(() => {
      console.log('Database connected successfully.');
      http.createServer(app).listen(3000);
      console.log('Listening 3000.');
    }, (err) => {
      console.log(err.message);
    });
