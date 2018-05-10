if (require('dotenv').config().error) throw result.error;
const debug = require('debug')('http');
const express = require('express');
const app = express();
const path = require('path');
const prod = app.get('env') === 'production';
app.use(require('helmet')());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(require('morgan')('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/pug-bootstrap',
    express.static(path.join(__dirname, '/node_modules/pug-bootstrap')));

const dbstring = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/radal`;
const mongoose = require('mongoose');
mongoose.connect(dbstring).
    then(() => {
      debug('Database connected!');
      const cookieParser = require('cookie-parser');
      app.use(cookieParser(process.env.SESSION_SECRET));
      app.use(require('body-parser').json());
      app.use(require('body-parser').urlencoded({extended: true}));
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
          secure: prod,
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
      app.use('/users', require('./routes/users'));

      let server;

      const port = 8443;
      if (!prod) {
        const fs = require('fs');
        const options = {
          key: fs.readFileSync('ssl-key.pem'),
          cert: fs.readFileSync('ssl-cert.pem'),
        };
        server = require('https').createServer(options, app);
      } else {
        app.enable('trust proxy');
        app.use((req, res, next) => {
          if (req.secure) return next();
          res.redirect('https://' + req.headers.host + req.url);
        });
        server = require('http').createServer(app);
      }

      const io = require('socket.io')(server);
      io.use(passportSocketIo.authorize({
        key: 'connect.sid',
        secret: process.env.SESSION_SECRET,
        store: sessionStore,
        passport: passport,
        cookieParser: cookieParser,
      }));

      io.on('connection', (socket) => {
        debug(socket.id, 'connected');
      });

      server.listen(port, () => {
        debug('Server up listening on ' + port);
      });
    }, (err) => {
      debug(err.message);
    });
