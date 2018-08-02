import express from 'express';
import { User } from '../models/models';
import expressValidator from 'express-validator';
import crypto from 'crypto';

function hashPassword(password) {
  var hashedPwd = crypto.createHmac('sha256', process.env.SECRET)
  .update(password)
  .digest('hex');
  return hashedPwd;
}
/* GET home page. */
export default function(passport) {
  var router = express.Router();
  router.use(expressValidator());

  router.get('/signup', function(req, res) {
    if(req.user){
      req.logout();
    }
    res.render('signup');
  });

  router.post('/signup', function(req, res) {
    console.log("i'm in the post")
    req.check('username' , 'Username is required').notEmpty();
    req.check('password', 'Password is required').notEmpty();
    req.check('password', 'Password must be longer than 5 charecters').isLength({ min: 5 });
    req.check('passwordRepeat', 'Passwords must match').equals(req.body.password);

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
      User.findOne({username: req.body.username},function(err,user){
        if(err) {
          console.log(err);
        } else if(!user) {
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
        }else{
          errors.push({msg:"Username already taken"})
          res.render("signup", {
            errors: errors,
            username: req.body.username
          });
        }
      })
    }
  });

  router.get('/login', function(req, res) {
    if(req.user){
      req.logout();
    }
    res.render('login');
  });


  router.post('/login', passport.authenticate('local' , {
    successRedirect: '/', failureRedirect: '/login'})
  );

  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  });

  return router;
}
