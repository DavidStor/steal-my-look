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
// POST look pic //
router.post('/lookpic',upload.single('avatar'), function(req, res) {
  console.log(req.file)
  res.redirect('/feed')
})

// POST Emoji //
router.post('/emoji/:postId/1', function(req, res) {
  /* Post.update({_id: postId}, function(err, updatedObject) {

  } */

  Post.findById(req.params.postId, function(err, thePost) {
    if (err) {
      console.log('error finding post');
    } else {
      console.log('successfully found post');
      thePost.set({ratings: {
        smileys: thePost.ratings.smileys + 1
      }})

    }
  })
  })
})

module.exports = router;
