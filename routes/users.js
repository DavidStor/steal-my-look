var express = require('express');
var router = express.Router();
import models from '../models/models';
var User = models.User;
var Post = models.Post;
var Product = models.Product;
var Look = models.Look;
var Rating = models.Rating;
var fs = require('fs');
import path from "path";
var multer  = require('multer')
const storage = multer.diskStorage({
  destination: path.resolve(__dirname,'../public/images/'),
  filename:function(req,file,cb){
    var coolbeans = file.fieldname + '-'+Date.now()+path.extname(file.originalname);
    User.update({_id:req.user._id},{profilePic:coolbeans},function(err,user){
      if(err){
        console.log(err)
      }else{
        cb(null,coolbeans)
      }
    })
  }
})
const upload=multer({
  storage:storage
})
const storage2 = multer.diskStorage({
  destination: path.resolve(__dirname,'../public/images/'),
  filename:function(req,file,cb){
    var coolbeans = file.fieldname + '-'+Date.now()+path.extname(file.originalname);
    cb(null,coolbeans)
  }
})
const upload2=multer({
  storage:storage2
})

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
    .exec(function(error, posts) {
      if (error) {
        console.log('error finding posts');
      } else {
        console.log('successfully found posts');
        res.render('feed', {posts: posts,
        user:req.user})
      }
    })
})

// GET single feed //
router.get('/feed/:id', function(req, res) {
  Post.findById(req.params.id)
    .populate('fromUser')
    .populate({
      path: 'Look',
      populate: [{path:'headwear'},{path:'top'},{path:'pants'},{path:'footwear'},{path:'coat'}]
    })
    .exec(function(error, post) {
      if (error) {
        console.log('error finding single post');
      } else {
        console.log('successfully found single post');
        res.render('feed', {posts: [post],
        user:req.user})
      }
    })
})

// POST profile pic //
router.post('/profilepic',upload.single('avatar'), function(req, res) {
  console.log(req.file)
  res.redirect('/editprofile')
})

// GET new post //
router.get('/newpost', function(req, res) {
  res.render('newpost',{user:req.user});
})

// POST new post //
router.post('/newpost',upload2.single('imgSrc'), function(req, res) {
  // var counter = 0;
  // if(req.body.headwearAmazon.trim().length !=0 && req.body.headwearDes.trim().length !=0 && req.body.headwearPrice.trim().length !=0 && req.body.headwearImage.trim().length !=0){
  //   counter++;
  // }
  // if(req.body.topAmazon.trim().length !=0 && req.body.topDes.trim().length !=0 && req.body.topPrice.trim().length !=0 && req.body.topImage.trim().length !=0){
  //   counter++;
  // }
  // if(req.body.pantsAmazon.trim().length !=0 && req.body.pantsDes.trim().length !=0 && req.body.pantsPrice.trim().length !=0 && req.body.pantsImage.trim().length !=0 ){
  //   counter++;
  // }
  // if(req.body.footwearAmazon.trim().length !=0 && req.body.footwearDes.trim().length !=0 && req.body.footwearPrice.trim().length !=0 && req.body.footwearImage.trim().length !=0 ){
  //   counter++;
  // }
  // if(counter<3){
  //   res.render('newpost',{error:"Must Fill in At Least 3 Pieces of Clothing"})
  // }else{
  var newHeadwear = new Product({
    Amazonlink: req.body.headwearAmazon,
    description: req.body.headwearDes,
    type: "headwear",
    price: req.body.headwearPrice,
    image: req.body.filename
  })
  var newTop = new Product({
    Amazonlink: req.body.topAmazon,
    description: req.body.topDes,
    type: "top",
    price: req.body.topPrice,
    image: req.body.topImage
  })
  var newPants = new Product({
    Amazonlink: req.body.pantsAmazon,
    description: req.body.pantsDes,
    type: "pants",
    price: req.body.pantsPrice,
    image: req.body.pantsImage
  })
  var newFootwear = new Product({
    Amazonlink: req.body.footwearAmazon,
    description: req.body.footwearDes,
    type: "footwear",
    price: req.body.footwearPrice,
    image: req.body.footwearImage
  })

  newHeadwear.save(function(err,header) {
    if (err) {
      console.log('error adding new headwear');
    } else {
      console.log('successfully saved new headwear');
      newTop.save(function(err,topper) {
        if (err) {
          console.log('error adding new top');
        } else {
          console.log('successfully saved new top');
          newPants.save(function(err,panter) {
            if (err) {
              console.log('error adding new pants');
            } else {
              console.log('successfully saved new pants');
              newFootwear.save(function(err,footer) {
                if (err) {
                  console.log('error adding new footwear');
                } else {
                  console.log('successfully saved new footwear');
                  var newLook = new Look({
                    headwear: header._id,
                    top: topper._id,
                    pants: panter._id,
                    footwear: footer._id
                  })
                  newLook.save(function(err, looker) {
                    if (err) {
                      console.log('error saving new look');
                    } else {
                      console.log('successfully saved new look');
                      var newPost = new Post({
                        image: req.body.image,
                        ratings: new Rating({
                          smileys: 0,
                          meh: 0,
                          frowns: 0
                        }),
                        Look: looker.id,
                        fromUser: req.user._id,
                      })
                      newPost.save(function(err) {
                        if (err) {
                          console.log('error adding new post', err);
                        } else {
                          console.log('successfully saved new post');
                          res.redirect('/');
                        }
                      })
                    }
                  })
                }
              })
            }
          })
        }
      })
    }
  })
  // }
})

// GET edit profile //
router.get('/editprofile', function(req, res) {
  res.render('editprofile',{user:req.user,editprofile:req.user});
})

// POST edit profile //
router.post('/editprofile', function(req, res) {
  req.check('firstname', 'First Name is required').notEmpty();
  req.check('lastname', 'Last Name is required').trim().notEmpty();

  console.log("before validation edit");
  var errors = req.validationErrors();
  var returnObj = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    bio:req.body.bio
  }
  if(errors) {
    //TO-DO Redo this so that if the user is wrong it will put him back
    console.log(errors);
    res.render("editprofile", {
      errors: errors,
      editprofile:returnObj,
      user:req.user
    });
  } else {
    User.update({_id:req.user._id},{bio:req.body.bio,lastname: req.body.lastname,firstname: req.body.firstname},function(err){
      if(err){
        console.log('line 241')
      }else{
        res.redirect('/profile');
      }
    })
  }
})

// POST Emoji //
router.post('/emoji/:postId/1', function(req, res) {
  /* Post.update({_id: postId}, function(err, updatedObject) {

  } */
  console.log('inside post emoji 1');
  var current =0;
  Post.findById(req.params.postId, function(err, thePost) {
    if (err) {
      console.log('error finding post', err);
    } else {
      console.log(thePost);
      //current= thePost.ratings.smileys;
      console.log('successfully found post');
      console.log('post is', thePost);
      thePost.set({ratings: {
        smileys: current + 1
      }});
      res.render('feed', {posts: thePost})
    }
  })
  })



module.exports = router;
