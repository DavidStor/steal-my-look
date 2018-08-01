var express = require('express');
var router = express.Router();

/* GET home page. */

router.use((req, res, next) => {
  if (req.user === undefined) {
      res.redirect('/login');
  } else {
      next();
  }
});

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
