const dotenv = require('dotenv');
const result = dotenv.config();
if (result.error) throw result.error;
const logger = require('morgan');
const debug = require('debug')('http');
const express = require('express');
const app = express();
const helmet = require('helmet');
const mongoose = require('mongoose');
const path = require('path');
const dev = app.get('env') !== 'production';
app.use(helmet());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/pug-bootstrap',
    express.static(path.join(__dirname, '/node_modules/pug-bootstrap')));

const dbstring = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/radal`;

mongoose.connect(dbstring).
    then(() => {
      debug('Database connected!');
      const cookieParser = require('cookie-parser');
      app.use(cookieParser(process.env.SESSION_SECRET));
      const session = require('express-session');
      const MongoStore = require('connect-mongo')(session);
      const sessionStore = new MongoStore(
          {mongooseConnection: mongoose.connection});
      app.use(session({
        secret: process.env.SESSION_SECRET,
        store: sessionStore,
        resave: true,
        saveUninitialized: true,
        proxy: true,
        cookie: {
          secure: !dev,
          maxAge: 2419200000,
        },
      }));
      const passport = require('passport');
      app.use(passport.initialize());
      app.use(passport.session());

      const passportSocketIo = require('passport.socketio');

      app.use('/', require('./routes/authenticate'));
      app.use('/authenticate', require('./routes/authenticate'));
      app.use('/map', require('./routes/map'));
      app.use('/error', require('./routes/error'));

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
        server.listen(port, () => {
          debug('Server up listening on ' + port);
        });
        const io = require('socket.io')(server);
        io.use(passportSocketIo.authorize({
          key: 'connect.sid',
          secret: process.env.SESSION_SECRET,
          store: sessionStore,
          passport: passport,
          cookieParser: cookieParser,
        }));
        io.on('connection', (socket) => {
          const User = require('./models/User');
          debug(socket.id, 'connected');
          socket.on('emojiSelect', (data) => {
            User.findById(socket.request.user._id, (err, user) => {
              if (err) debug(err.message);
              if (user) debug(user);
              user.emoji = data.emoji;
              user.save((err) => {
                if (err) debug(err.message);
              });
            });
          });
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
