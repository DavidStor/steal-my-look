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
        res.render('feed', {posts: post})
      }
    })
})
