var express = require('express');
var router = express.Router();
import models from '../models/models';
var User = models.User;
var Post = models.Post;
var Product = models.Product;
var Look = models.Look;
var Ratings = models.Ratings

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
router.get('/profile/newpost', function(req, res) {

})

// POST new post //
router.post('/profile/newpost', function(req, res) {
  var newPost = new Post({
    image: req.body.image,
    likes: 0,
    Look: {
      headware: req.body.headwear,
      top: req.body.top,
      pants: req.body.pants,
      footwear: req.body.footwear,
      coat: req.body.coat
    },
    fromUser: req.user._id,
    ratings: {
      smileys: 0,
      meh: 0,
      frowns: 0
    }
  })
  newPostDB.save(function(err) {
    if (err) {
      console.log('error adding new post');
    } else {
      console.log('successfully saved new post');
    }
  })
})
module.exports = router;
