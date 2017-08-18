const express     = require('express'),
      passport    = require('passport'),
      router      = express.Router({mergeParams: true}),
      flash       = require('connect-flash'),
      Vendor         = require('../models/vendor'),
      Comments    = require('../models/comment'),
      Mid         = require('../middleware/index');


// RENDER CAMPGROUND ADD FORM
router.get('/new', Mid.isLoggedIn, (req, res) => {
  res.render('vendors/new');
});

// COMMENT FORM ROUTE
// router.get('/new', Mid.isLoggedIn, (req, res) => {
//   Vendor.findById(req.params.id, (err, pet) => {
//     if (err) {
//       console.log(err);
//     } else {
//       res.render('comments/new', {pet: pet});
//     }
//   });
// });

// ADD COMMENT ROUTE
router.post('/', Mid.isLoggedIn, (req, res) => {
  Vendor.findById(req.params.id, (err, pet) => {
    if (err) {
      console.log(err);
      res.redirect('/pets');
    } else {
      Comments.create(req.body.comments, (err, comment) => {
        if (err) {
          req.flash('error', 'Something went wrong!');
          console.log(err);
        }else {
          comment.author.id = req.user.id;
          comment.author.username = req.user.username;
          comment.save();
          pet.comments.push(comment);
          pet.save();
          req.flash('success', 'Successfully added a comment');
          res.redirect(`/pets/${pet._id}`);
        }
      });
    }
  });
});

// EDIT COMMENT ROUTE
router.get('/:comment_id/edit', Mid.checkCommentOwnership, (req, res) => {
  Comments.findById(req.params.comment_id, (err, foundComment) => {
    if (err) {
      console.log(err);
      res.redirect('back');
    }else {
      res.render('comments/edit', {pet_id: req.params.id, comment: foundComment });
    }
  });
});

// UPDATE COMMENT ROUTE
router.put('/:comment_id/', Mid.checkCommentOwnership,  (req, res) => {
  Comments.findByIdAndUpdate(req.params.comment_id, req.body.comments, (err, updatedComments) => {
    console.log(req.params.comment_id);
    console.log(req.body.comments);
    if (err) {
      console.log(err);
      res.redirect('back');
    }else {
      res.redirect('/pets/'+req.params.id);
    }
  });
});

// REMOVE COMMENT ROUTE
// DELETE CAMPGROUND
router.delete('/:comment_id', Mid.checkCommentOwnership, (req, res) => {
  Comments.findByIdAndRemove(req.params.comment_id, (err) => {
    if (err) {
      console.log(err);
      res.redirec('back');
    }else {
      res.redirect('/pets/'+req.params.id);
    }
  });
});


// function Mid.isLoggedIn(req, res, next){
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.redirect('/login');
// }

// function Mid.checkCommentOwnership(req, res, next){
//   if (req.isAuthenticated()) {
//     Comments.findById(req.params.comment_id, (err, foundComment) => {
//       if (err) {
//         res.redirect('/campgrounds');
//       }else {
//         if (foundComment.author.id.equals(req.user._id)) {
//           next();
//         }else {
//           req.flash('error', 'You don\'t have permission to do that');
//           res.render('campgrounds/edit', {campground: foundComment});
//         }
//       }
//     });
//   }else {
//     req.flash('error', 'You need to be logged in to do that');
//     res.redirect('back');
//   }
// };

module.exports = router;
