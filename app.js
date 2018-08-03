var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
import models from './models/models.js';
var User = models.User;
import users from './routes/users';
import index from './routes/index';
import auth from './routes/auth';
import wardrober from './routes/wardrobe';
var app = express();
var mongoose = require('mongoose');
var sta = require('connect-mongo');
var passport = require('passport');
var LocalStrategy = require('passport-local');
import session from 'express-session';
import crypto from 'crypto';
var MongoStore = sta(session);
import bodyParser from 'body-parser';

mongoose.connection.on('connected',function(){
  console.log('MongoDB Connected')
})
mongoose.connect(process.env.MONGODB_URI)
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json({limit: '50mb'}));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
  secret: process.env.SECRET,
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));

function hashPassword(password) {
  var hashedPwd = crypto.createHmac('sha256', process.env.SECRET)
  .update(password)
  .digest('hex');
  return hashedPwd;
}

passport.use(new LocalStrategy(function(username, password, done) {
  // Find the user with the given username
  User.findOne({ username: username}).then((user) => {
    // if no user present, auth failed
    if (!user) {
      console.log(user);
      var flag = true;
      return done(null, false);
    }

    // if passwords do not match, auth failed

    if (hashPassword(password) === user.password) {
      // Sucessful login
      return done(null, user);
    } else {
      // Fail login
      var flag = true;
      return done(null, false);
    }
  }).catch((err) => {
    // if there's an error, finish trying to authenticate (auth failed)
    console.log(err);
    return done(err);
  });
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
app.use('/', auth(passport));
app.use('/', index);
app.use('/', users);
app.use('/', wardrober);
// catch 404 and forward to error handler

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
