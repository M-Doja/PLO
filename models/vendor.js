var mongoose = require('mongoose');

// SCHEMA
var vendorSchema = new mongoose.Schema({
  bizName: String,
  bizType: String,
  bizEmail: String,
  bizNumber: Number,
  bizLocation: String,
  bizBio: String,
  bizAvatar: String,
  bizCategory: String,
  bizServices: [{
      prod: String,
      desc: String,
      price: Number,
      image: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  operator: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
});

var Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;
