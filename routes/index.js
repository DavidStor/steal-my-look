var express = require('express');
var router = express.Router();
var models =require('../models/models');
var User = models.User;
var Post = models.Post;
var Product = models.Product;
var Look = models.Look;
var Ratings = models.Ratings

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

// GET feed //
router.get('/feed', function(req, res) {
  Post.find()
    .populate('fromUser')
    .populate({
      path:'Look',
      populate:[{path:'headwear'},{path:'top'},{path:'pants'},{path:'footwear'},{path:'coat'}]
    })
    .populate('ratings')
    .exec(function(error, posts) {
      if (error) {
        console.log('error finding posts');
      } else {
        console.log('successfully found posts');
        res.render('feed', {posts: posts})
      }
    })
})

// POST profile pic //
router.post('/profilepic', function(req, res) {

})

// GET new post //
router.post('/profile/newpost', function(req, res) {
  var newPost = new Post
})

// POST new post //
router.post('/profile/newpost', function(req, res) {
  var newPost = new Post
})

module.exports = router;
