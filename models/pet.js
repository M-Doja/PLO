var mongoose = require('mongoose');

// SCHEMA
var petSchema = new mongoose.Schema({
  name: String,
  images:String,
  album : [{
    path: {
    type: String,
    required: true,
    trim: true
    },
    originalname: {
    type: String,
    required: true
    }
  }],
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
  },
  isPrivate: {
    type: Boolean,
    default: false
  }
});

var Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;
