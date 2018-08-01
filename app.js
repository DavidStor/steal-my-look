var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var models = require('./models/models');
var User = models.User;
import users from './routes/users';
import index from './routes/index';
import auth from './routes/auth';
var app = express();
var mongoose = require('mongoose')
var sta = require('connect-mongo');
var passport = require('passport');
var LocalStrategy = require('passport-local')
import session from 'express-session';
var MongoStore = sta(session)
mongoose.connection.on('connected',function(){
  console.log('MongoDB Connected')
})
mongoose.connect(process.env.MONGODB_URI)
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
// import products from './seed/products.json'
// var productPromises = products.map((product) => (new Product(product).save()));
// Promise.all(productPromises)
//   .then(() => console.log('Success. Created products!'))
//   .catch((err) => console.log('Error', err))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var crypto = require('crypto');
var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};
var sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        passwordHash:value
    };
};
function saltHashPassword(username,userpassword,salty) {
    var salt = salty||genRandomString(16); /** Gives us salt of length 16 */
    var passwordData = sha512(userpassword, salt);
    var z = new User({
      username:username,
      hashedPassword:passwordData.passwordHash
    })
    z.save(function(err){
      console.log(err)
    });
}


console.log('3')
app.use(session({
  secret: process.env.SECRET||'hello',
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));
passport.use(new LocalStrategy(function(username, password, done) {
  // Find the user with the given username
  // May need to adapt this to your own model
  User.findOne({ username: username }, function (err, user) {
    // if there's an error, finish trying to authenticate (auth failed)
    if (err) { return done(err); }
    // if no user present, auth failed
    if (!user) {
      return done(null, false, { message: 'Incorrect username or password.' });
    }
    // if passwords do not match, auth failed
     /** Gives us salt of length 16 */
    var passwordData = sha512(password, process.env.SECRET||'hello');
    if (user.hashedPassword !== passwordData.passwordHash) {
      return done(null, false, { message: 'Incorrect username or password.' });
    }
    // auth has has succeeded
    return done(null, user);
  });
}));

passport.serializeUser((user, done) => {
  done(null, user._id);
});
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
app.use(passport.initialize());
app.use(passport.session())
app.use('/', auth(passport));
app.use('/', index);
app.use('/users', users);
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
