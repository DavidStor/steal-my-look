// POST edit profile //
router.post('/editprofile', function(req, res) {
  User.update({_id: req.user._id}, {description: req.body.newDes}, {firstname: req.body.newFirst}, {lastname: req.body.newLast});
})
