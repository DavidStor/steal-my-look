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
    type: Image
  },
  posts: {
   //reference to schema of post
  }
});




var User = mongoose.model('User', userSchema);
export { User }

