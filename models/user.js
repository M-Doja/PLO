var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  isAdmin: {type: Boolean, default: false},
  pets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet'
    }
  ],
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
