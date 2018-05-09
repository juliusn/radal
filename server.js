const dotenv = require('dotenv');
const express = require('express');
const logger = require('morgan');
const debug = require('debug')('http');
const https = require('https');
const app = express();
const helmet = require('helmet');
const expressSession = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const result = dotenv.config();
const path = require('path');
const authRouter = require('./routes/authenticate');
const mapRouter = require('./routes/map');
if (result.error) throw result.error;
const env = app.get('env');
const dev = env !== 'production';
debug('NODE_ENV: ', env);
const dbstring = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/radal`;
app.use(helmet());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/pug-bootstrap',
    express.static(path.join(__dirname, '/node_modules/pug-bootstrap')));

app.use(expressSession({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/authenticate', authRouter);
app.use('/', mapRouter);

mongoose.connect(dbstring).
    then(() => {
      debug('Database connected!');
      const httpsPort = 8443;
      if (dev) {
        const fs = require('fs');
        const sslkey = fs.readFileSync('ssl-key.pem');
        const sslcert = fs.readFileSync('ssl-cert.pem');
        const options = {
          key: sslkey,
          cert: sslcert,
        };
        https.createServer(options, app).listen(httpsPort);
        debug('HTTPS server up listening ' + httpsPort);
      } else {
        app.enable('trust proxy');
        app.use((req, res, next) => {
          if (req.secure) {
            next();
          } else {
            res.redirect('https://' + req.headers.host + req.url);
          }
        });
        app.listen(httpsPort);
      }
    }, (err) => {
      debug(err.message);
    });
