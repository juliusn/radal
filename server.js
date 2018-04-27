const dotenv = require('dotenv');
const express = require('express');
const logger = require('morgan');
const debug = require('debug')('http');
const http = require('http');
const https = require('https');
const app = express();
const mongoose = require('mongoose');
const env = app.get('env');
const result = dotenv.config();
if (result.error) throw result.error;

app.use(logger('dev'));

app.get('/', (req, res) => {
  res.send('works');
});

mongoose.connect(
    `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/radal`).
    then(() => {
      debug('Database connected!');
      let httpPort = !env ? 80 : 8080;
      let httpsPort = !env ? 443 : 3000;
      if (env) {
        const fs = require('fs');
        const sslkey = fs.readFileSync('ssl-key.pem');
        const sslcert = fs.readFileSync('ssl-cert.pem');
        const options = {
          key: sslkey,
          cert: sslcert,
        };
        https.createServer(options, app).listen(httpsPort);
        debug('HTTPS server up listening ' + httpsPort);
        http.createServer((req, res) => {
          res.writeHead(301,
              {'Location': 'https://localhost:' + httpsPort + req.url});
          res.end();
          debug('HTTP requests will be redirected over HTTPS to ' + httpsPort);
        }).listen(httpPort);
        debug('HTTP server up listening ' + httpPort);
      } else {
        app.enable('trust proxy');
        app.use((req, res, next) => {
          if (req.secure) {
            next();
          } else {
            res.redirect('https://' + req.headers.host + req.url);
          }
        });
        app.listen(3000);
      }
    }, (err) => {
      debug(err.message);
    });
