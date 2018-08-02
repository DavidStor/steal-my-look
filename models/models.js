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
  Look: {
    type: mongoose.Schema.ObjectId,
    ref: 'Look'
  },
  fromUser: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
})
var lookSchema = new mongoose.Schema({
  headwear:{
    type: mongoose.Schema.ObjectId,
    ref: 'Product'
  },
  top:{
    type: mongoose.Schema.ObjectId,
    ref: 'Product'
  },
  pants:{
    type: mongoose.Schema.ObjectId,
    ref: 'Product'
  },
  footwear:{
    type: mongoose.Schema.ObjectId,
    ref: 'Product'
  },
  accessories:[
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Product'
    }
  ]
})
var productSchema = new mongoose.Schema({
  link: String,
  description: String,
  type:String,
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
var Look = mongoose.model('Look', lookSchema);

export {User, Post, Product, Look}
