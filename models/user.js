var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
  username: String,
  fName: String,
  lName: String,
  avatar: String,
  bio: String,
  email: String,
  password: String,
  isAdmin: {
    type: Boolean,
    default: false
  },
  isVendor: {
    type: Boolean,
    default: false
  },
  venderSvcs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor'
  }],
  forumPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Forum'
  }],
  pets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet'
  }],
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
