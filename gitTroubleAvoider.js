// POST look pic //
router.post('/lookpic',upload.single('avatar'), function(req, res) {
  console.log(req.file)
  res.redirect('/feed')
})

// POST Emoji //
router.post('/emoji/:postId', function(req, res) {
  console.log('req.user is ISSSSS', req.user);
  console.log('req.body is ISSSSS', req.body);
  User.findById()
})
