import express from 'express';
import { User } from '../models/models';
import expressValidator from 'express-validator';

/* GET home page. */
export default function(passport) {
  var router = express.Router();
  router.use(expressValidator());

  router.get('/signup', function(req, res) {
    res.render('signup');
  });

  router.post('/signup', function(req, res) {
    console.log("i'm in the post")
    req.check('username' , 'username is required').notEmpty();
    req.check('password', 'password is required').notEmpty();
    req.check('password', 'password must be longer than 5 charecters').isLength({ min: 5 });
    req.check('passwordRepeat', 'passwords must match').equals(req.body.password);
  
    console.log("before validation");
    var errors = req.validationErrors();
   
    if(errors) {
      //TO-DO Redo this so that if the user is wrong it will put him back
      console.log(errors);
      res.render("signup", {
        errors: errors,
        username: req.body.username
      });
    } else {
      var newUser = new User({
        username: req.body.username,
        password: req.body.password
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
    successRedirect: '/', failureRedirect: '/login'})
  );

  router.get('/logout', function(req, res) {
    req.logout();
    req.session.cartArr=[];
    res.redirect('/login');
  });
  
  return router;
}
