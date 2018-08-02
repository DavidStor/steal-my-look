import express from 'express';
import { User } from '../models/models';
import expressValidator from 'express-validator';
import crypto from 'crypto';
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
    })
}
/* GET home page. */
export default function(passport) {
  var router = express.Router();
  router.use(expressValidator());

  router.get('/signup', function(req, res) {
    res.render('register');
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
      User.findOne({username:req.body.username},function(err,user){
        if(err){
          console.log(err);
        }else if(user==null){
          saltHashPassword(req.body.username,req.body.password, process.env.SECRET)
          res.redirect('/')
        }else{
          res.render("signup", {
            errors: "Username already taken",
            username: req.body.username
          });
        }
      })
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
