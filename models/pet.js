var mongoose = require('mongoose');

// SCHEMA
var petSchema = new mongoose.Schema({
  name: String,
  images:String,
  description: String,
  type: String,
  age: Number,
  breed: String,
  location: String,
  locationStr: String,
  lat: Number,
  lng: Number,
  createdAt: {
    type: Date,
    default: Date.now
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comments'
    }
  ],
  owner: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  }
});

var Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;
