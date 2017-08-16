var mongoose = require('mongoose');

// SCHEMA
var forumSchema = new mongoose.Schema({
  threads: [{
    category: {
      type: String,
      required: true
    },
    topic: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    body: {
      type: String,
      required: true
    },
    likes: {
      type: Number
    },
    images: [{
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
    createdAt: {
      type: Date,
      default: Date.now
    },
    author: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      username: {
        type: String,
        trim: true
      }
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comments'
    }]
  }]
});

var Forum = mongoose.model('Forum', forumSchema);

module.exports = Forum;
