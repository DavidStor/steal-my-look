var express = require('express');
var router = express.Router();
import models from '../models/models';
var User = models.User;
var Post = models.Post;
var Product = models.Product;
var Look = models.Look;
var Ratings = models.Ratings;
var Wardrobe = models.Wardrobe;

// USE check for user //
router.use((req, res, next) => {
  if (req.user === undefined) {
      res.redirect('/login');
  } else {
      next();
  }
});

// GET homepage //
router.get('/', function(req, res, next) {
  res.redirect('/feed')
});

// GET profile //
router.get('/profile', function(req, res) {
  console.log(req.user.username);
  res.render('profile', {user: req.user});
});

// // GET feed //
// router.get('/feed', function(req, res) {
//   Post.find()
//     .populate('fromUser')
//     .populate({
//       path:'Look',
//       populate:[{path:'headwear'},{path:'top'},{path:'pants'},{path:'footwear'}]
//     })
//     .exec(function(error, posts) {
//       if (error) {
//         console.log('error finding posts');
//       } else {
//         console.log('successfully found posts');
//         console.log(posts)
//         res.render('feed', {posts: posts,user: req.user})
//       }
//     })
// })

// POST profile pic //

// GET new post //

// POST new post //




module.exports = router;
