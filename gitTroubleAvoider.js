// POST look pic //
router.post('/lookpic',upload.single('avatar'), function(req, res) {
  console.log(req.file)
  res.redirect('/feed')
})

// GET wardrobe //
router.get('/wardrobe', function(req, res) {
  var owner = req.user._id;
  User.findById(owner, function(error, user) {
    var wardrobe
  })
  res.render('wardrobe', {wardrobe: wardrobe,
  user:req.user})
})

// POST Emoji //
router.post('/emoji', function(req, res) {
  console.log(req);
})
