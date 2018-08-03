
var express = require('express');
var router = express.Router();
import models from '../models/models';
var User = models.User;
var Post = models.Post;
var Product = models.Product;
var Look = models.Look;
var fs = require('fs');
import path from "path";
router.get('/wardrobe', function(req, res) {
  var owner = req.user._id;
  User.findbyId(owner)
  .populate('wardrobe')
  .exec(function(error, user) {
    if(err){
      console.log(err)
    }else{
        res.render('wardrobe', {wardrobe: user.wardrobe,user:user})
    }
  })
})

module.exports = router;
