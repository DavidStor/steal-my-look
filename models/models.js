var mongoose = require('mongoose');
var connect = process.env.MONGODB_URI;
mongoose.connect(connect);

var userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  profilePic: {
    type: String
  },
  posts: {
   type: mongoose.Schema.ObjectId,
   ref: 'Post'
  }
});

var postSchema = new mongoose.Schema({
  image: String,
  likes: Number,
  products: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Product'
  }],
  fromUser: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
})

var productSchema = new mongoose.Schema({
  link: String,
  description: String,
  price: Number,
  image: String,
  fromPost: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post'
  }
})


var User = mongoose.model('User', userSchema);
var Post = mongoose.model('Post', postSchema);
var Product = mongoose.model('Product', productSchema);

export {User, Post, Product}
