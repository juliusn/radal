const dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const https = require('https');
const http = require('http');
const fs = require('fs');
const sslkey = fs.readFileSync('ssl-key.pem');
const sslcert = fs.readFileSync('ssl-cert.pem');
const options = {
  key: sslkey,
  cert: sslcert,
};
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
      https.createServer(options, app).listen(3000);
      http.createServer((req, res) => {
        res.writeHead(301, {'Location': 'https://localhost:3000' + req.url});
        res.end();
      }).listen(8080);
      console.log('Listening 8080.');
    }, (err) => {
      console.log(err.message);
    });
