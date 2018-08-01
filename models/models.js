var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var userSchema = new Schema({
  username:String,
  hashedPassword:String,
  keySalt:String
})

var User = mongoose.model('User',userSchema);
module.exports = {
  User:User
}
