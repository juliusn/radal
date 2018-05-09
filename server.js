const dotenv = require('dotenv');
const result = dotenv.config();
if (result.error) throw result.error;
const logger = require('morgan');
const debug = require('debug')('http');
const express = require('express');
const app = express();
const helmet = require('helmet');
const expressSession = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const path = require('path');
const authRouter = require('./routes/authenticate');
const mapRouter = require('./routes/map');
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
      const port = 8443;
      if (dev) {
        const fs = require('fs');
        const sslkey = fs.readFileSync('ssl-key.pem');
        const sslcert = fs.readFileSync('ssl-cert.pem');
        const options = {
          key: sslkey,
          cert: sslcert,
        };
        const server = require('https').createServer(options, app);
        const io = require('socket.io')(server);
        server.listen(port, () => {
          debug('Server up listening on ' + port);
        });
        io.on('connection', (socket) => {
          debug(socket.id, 'connected');
        });
      } else {
        app.enable('trust proxy');
        app.use((req, res, next) => {
          if (req.secure) {
            next();
          } else {
            res.redirect('https://' + req.headers.host + req.url);
          }
        });
        app.listen(port);
      }
    }, (err) => {
      debug(err.message);
    });
