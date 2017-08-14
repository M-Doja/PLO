const middleWareObj = {},
      Pet    = require('../models/pet'),
      Comments      = require('../models/comment');

middleWareObj.checkPetOwnership = function(req, res, next){
  if (req.isAuthenticated()) {
    Pet.findById(req.params.id, (err, foundPet) => {
      if (err) {
        req.flash('error', 'Unable to find that specific campground')
        res.redirect('/pets');
      }else {
        if (foundPet.owner.id.equals(req.user._id) || req.user.isAdmin) {
          next();
        }else {
          req.flash('error', 'You don\'t have permission to do that')
          res.render('pets/edit', {pet: foundPet});
        }
      }
    });
  }else {
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('back');
  }
};

middleWareObj.checkCommentOwnership = function(req, res, next){
  if (req.isAuthenticated()) {
    Comments.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        res.redirect('/pets');
      }else {
        if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
          next();
        }else {
          req.flash('error', 'You don\'t have permission to do that');
          res.render('pets/edit', {pet: foundComment});
        }
      }
    });
  }else {
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('back');
  }
};

middleWareObj.isLoggedIn = function(req, res, next){
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'You need to be logged in to do that');
  res.redirect('/login');
};


module.exports = middleWareObj
