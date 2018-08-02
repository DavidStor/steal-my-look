var express = require('express');
var router = express.Router();
import models from '../models/models';
var User = models.User;
var Post = models.Post;
var Product = models.Product;
var Look = models.Look;
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
        res.render('feed', {posts: posts})
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
        res.render('feed', {posts: [post]})
      }
    })
})

// POST profile pic //
router.post('/profilepic',upload.single('avatar'), function(req, res) {
  console.log(req.file)
  res.send('hi')
})

// GET new post //
router.get('/newpost', function(req, res) {
  res.render('newpost');
})

// POST new post //
router.post('/newpost', function(req, res) {
  var counter = 0;
  if(req.body.headwearAmazon.trim().length !=0 && req.body.headwearDes.trim().length !=0 && req.body.headwearPrice.trim().length !=0 && req.body.headwearImage.trim().length !=0){
    counter++;
  }
  if(req.body.topAmazon.trim().length !=0 && req.body.topDes.trim().length !=0 && req.body.topPrice.trim().length !=0 && req.body.topImage.trim().length !=0){
    counter++;
  }
  if(req.body.pantsAmazon.trim().length !=0 && req.body.pantsDes.trim().length !=0 && req.body.pantsPrice.trim().length !=0 && req.body.pantsImage.trim().length !=0 ){
    counter++;
  }
  if(req.body.footwearAmazon.trim().length !=0 && req.body.footwearDes.trim().length !=0 && req.body.footwearPrice.trim().length !=0 && req.body.footwearImage.trim().length !=0 ){
    counter++;
  }
  if(counter<3){
    res.render('newpost',{error:"Must Fill in At Least 3 Pieces of Clothing"})
  }else{
    var newHeadwear = new Product({
      Amazonlink: req.body.headwearAmazon,
      description: req.body.headwearDes,
      type: "headwear",
      price: req.body.headwearPrice,
      image: req.body.headwearImage
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
        newtop.save(function(err,topper) {
          if (err) {
            console.log('error adding new top');
          } else {
            console.log('successfully saved new top');
            newpants.save(function(err,panter) {
              if (err) {
                console.log('error adding new pants');
              } else {
                console.log('successfully saved new pants');
                newfootwear.save(function(err,footer) {
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
                          likes: 0,
                          Look: looker.id,
                          fromUser: req.user._id,
                        })
                        newPost.save(function(err) {
                          if (err) {
                            console.log('error adding new post');
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
  }
})

router.get('/wardrobe', function(req, res) {
  var owner = req.user._id;
  User.findbyID(owner)
  res.render('wardrobe', {wardrobe: wardrobe})
})

module.exports = router;
