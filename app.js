require('dotenv').config();

const bodyParser        = require('body-parser');
const cookieParser      = require('cookie-parser');
const express           = require('express');
const session           = require("express-session");
const favicon           = require('serve-favicon');
const hbs               = require('hbs');
const mongoose          = require('mongoose');
const logger            = require('morgan');
const path              = require('path');
const passport          = require("passport");
const LocalStrategy     = require("passport-local").Strategy;
const ensureLogin       = require("connect-ensure-login");
const flash             = require("connect-flash");
const MongoStore        = require("connect-mongo")(session);
const bcrypt            = require("bcryptjs");
const User              = require('./models/User');
const app_name          = require('./package.json').name;
const debug             = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);


const app = express();

mongoose
  .connect(process.env.MONGODB_URI, {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

  passport.serializeUser((user, cb) => {
    cb(null, user._id);
  });
  
  passport.deserializeUser((id, cb) => {
    User.findById(id, (err, user) => {
      if (err) { return cb(err); }
      cb(null, user);
    });
  });
  
  
  passport.use(new LocalStrategy((username, password, next) => {
    User.findOne({ username }, (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(null, false, {message: "Incorrect username" });
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return next(null, false, {message: "Incorrect password" });
      }
      return next(null, user, {message: 'you have successfully logged in'});
    });
  }));

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));

//connect-flash package =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=--=-=-=-=-=
app.use(flash());

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));


//passport set up
app.use(session({
  secret: "basic-auth-secret",
  cookie: { maxAge: 600000 },
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 
  })
}));

app.use(passport.initialize());
app.use(passport.session());


// default value for title local
app.locals.title = 'Game-Start';

app.use(function (req, res, next){
  res.locals = {
    user: req.user
  };
  next();
})

// app.use(express.favicon());

const index = require('./routes/index');
app.use('/', index);

const signup = require('./routes/authRoutes');
app.use('', signup)

const login = require('./routes/authRoutes');
app.use('', login)

const profile = require('./routes/profileRoutes');
app.use('', profile)

const game = require('./routes/gameRoutes');
app.use('', game)

module.exports = app;
