import express from 'express';
import models from '../models/models.js';
var User = models.User;
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

  // GET signup //
  router.get('/signup', function(req, res) {
    if(req.user){
      req.logout();
    }
    res.render('signup');
  });

  // Post signup //
  router.post('/signup', function(req, res) {
    console.log("i'm in the post")
    req.check('username' , 'Username is required').notEmpty();
    req.check('firstname', 'First Name is required').notEmpty();
    req.check('lastname', 'Last Name is required').trim().notEmpty();
    req.check('password', 'Password is required').notEmpty();
    req.check('password', 'Password must be longer than 5 characters').isLength({ min: 5 });
    req.check('passwordRepeat', 'Passwords must match').equals(req.body.password);

    console.log("before validation");
    var errors = req.validationErrors();
    var returnObj = {
      username: req.body.username,
      password: req.body.password,
      passwordRepeat:req.body.passwordRepeat,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    }
      User.findOne({username: req.body.username},function(err,user){
        if(err) {
          console.log(err);
        } else if(!user) {
          if(errors) {
            //TO-DO Redo this so that if the user is wrong it will put him back
            console.log(errors);
            res.render("signup", {
              errors: errors,
              username: req.body.username,
              register:returnObj
            });
          } else {
            var hashedPassword = hashPassword(req.body.password);
            var newUser = new User({
              username: req.body.username,
              password: hashedPassword,
              firstname: req.body.firstname,
              lastname: req.body.lastname,
            });
            newUser.save().then((result) => {
              res.redirect('/login');
            }).catch((err) => {
              res.send(err);
            });
          }
        }else{
          if(errors) {
            //TO-DO Redo this so that if the user is wrong it will put him back
            errors.push({msg:"Username already taken"})
          }else{

            errors=[{msg:"Username already taken"}]
          }
          res.render("signup", {
            errors: errors,
            username: req.body.username,
            register:returnObj
          });
        }
      })
    })

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
    res.redirect('/');
  });

  return router;
}
