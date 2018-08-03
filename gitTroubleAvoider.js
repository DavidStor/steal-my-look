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

// GET about us //
router.get('/about', function(req, res) {
  res.render('about');
})

// GET error page //
router.get('/error', function(req, res) {
  res.render('autisticScreeching');
})



module.exports = router;
