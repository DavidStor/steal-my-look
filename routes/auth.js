import express from 'express';
import { User } from '../models/models';
import expressValidator from 'express-validator';
import crypto from 'crypto'; 
/* GET home page. */
export default function(passport) {
  var router = express.Router();
  router.use(expressValidator());

  function hashPassword(password) {
    var hashedPwd = crypto.createHmac('sha256', process.env.SECRET)
    .update(password)
    .digest('hex');
    return hashedPwd;
  }

  router.get('/signup', function(req, res) {
    res.render('signup');
  });

  router.post('/signup', function(req, res) {

    req.check('username' , 'username is required').notEmpty();
    req.check('password', 'password is required').notEmpty();
    req.check('password', 'password must be longer than 5 charecters').isLength({ min: 5 });
    req.check('passwordRepeat', 'passwords must match').equals(req.body.password);

    var errors = req.validationErrors();

    if(errors) {
      //TO-DO Redo this so that if the user is wrong it will put him back
      res.render("signup", {
        errors: errors,
        username: req.body.username
      });
    } else {
      var hashedPassword = hashPassword(req.body.password);
      var newUser = new User({
        username: req.body.username,
        password: hashedPassword
      });

      newUser.save().then((result) => {
        res.redirect('/login');
      }).catch((err) => {
        res.send(err);
      });
    }
  });

  router.get('/login', function(req, res) {
    res.render('login');
  });


  router.post('/login', passport.authenticate('local' , {
    successRedirect: '/profile', failureRedirect: '/login'})
  );

  router.get('/logout', function(req, res) {
    req.logout();
    req.session.cartArr=[];
    res.redirect('/login');
  });

  return router;
}
