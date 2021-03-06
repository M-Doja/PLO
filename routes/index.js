const express     = require('express'),
      router      = express.Router(),
      passport    = require('passport'),
      flash       = require('connect-flash'),
      Mid         = require('../middleware/index'),
      config      = require('../config/config'),
      Pets        = require('../models/pet'),
      User        = require('../models/user');

router.get('/', (req, res) => {
  res.render('landing', {title: "Welcome!"});
});
router.get('/about', (req, res) => {
  res.render('about', {pageHeader: "About PetsLiveOn"});
});
router.get('/community', (req, res) => {
  res.render('community', {pageHeader: "Welcome to the PetsLiveOn Community!"});
});
router.get('/forum', (req, res) => {
  res.render('forum', {pageHeader: "Get Advice on the PetsLiveOn Forum!"});
});
router.get('/vendors', (req, res) => {
  res.render('vendors', {pageHeader: "PetsLiveOn Vendors"});
});


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

router.get('/memorials', (req, res) => {
  if(req.query.search) {
      const regex = new RegExp(escapeRegex(req.query.search), 'gi');
      // Get all campgrounds from DB
      Pets.find({name: regex}, function(err, allPets){
         if(err){
            console.log(err);
         } else {
            res.render("memorial",{pets: allPets, pageHeader: "PetsLiveOn Memorials"});
         }
      });
  } else {
    Pets.find({}, function(err, allPets){
       if(err){
           console.log(err);
       } else {
          if(req.xhr) {
            res.json(allPets);
            console.log(allPets);
          } else {
            res.render("memorial",{pageHeader: "PetsLiveOn Memorials",pets: allPets});
          }
       }
    });
  }

});

// ========================================
// USER ROUTES
// ========================================
// GET REGISTER FORM
router.get('/register', (req, res) => {
  res.render('register');
});

// SIGN UP
router.post('/register', (req, res) => {
  var newUser =  new User({username: req.body.username});
  if (req.body.adminCode === config.SECRET) {
    newUser.isAdmin= true;
  }
  User.register(newUser ,req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render('register', {error: err.message})
    }
    passport.authenticate('local')(req, res, function(){
      req.flash('success', 'Successful Registraion! Welcome to YelpCamp '+ user.username );
      res.redirect('/pets');
    });
  });
});

router.get('/login', (req, res) => {
  res.render('login');
});

// SIGN UP
router.post('/login', passport.authenticate('local', {
  successRedirect: '/pets',
  failureRedirect: '/login'
}), (req, res) => {

});

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Logged you out');
  res.redirect('/');
});


// GET User Profile
router.get('/user/:id', (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err) {
      console.log(err);
      req.flash('error', err);
      res.render('/pets');
    }else {
      Pets.find({"owner.id": req.params.id}, function(err, allPets){
         if(err){
            console.log(err); 
         }
         else {
            if(req.xhr) {
              res.json(allPets);
              console.log(allPets);
            } else {
              res.render('user', {pageHeader: user.username,pets: allPets, user:user});
            }
         }
      });
    }
  });
});


module.exports = router;
