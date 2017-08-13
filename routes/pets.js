const express     = require('express'),
      router      = express.Router(),
      passport    = require('passport'),
      flash       = require('connect-flash'),
      geocoder    = require('geocoder'),
      Pet         = require('../models/pet'),
      Mid         = require('../middleware/index');



// DISPLAY ALL CAMPGROUNDS
// Define escapeRegex function for search feature
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

//INDEX - show all campgrounds
router.get("/", function(req, res){
  if(req.query.search) {
      const regex = new RegExp(escapeRegex(req.query.search), 'gi');
      // Get all campgrounds from DB
      Pet.find({name: regex}, function(err, allPets){
         if(err){
            console.log(err);
         } else {
            res.render("pets/index",{pets: allPets, page: 'campgrounds'});
         }
      });
  } else {
      // Get all campgrounds from DB
      Pet.find({}, function(err, allPets){
         if(err){
             console.log(err);
         } else {
            if(req.xhr) {
              res.json(allPets);
            } else {
              res.render("pets/index",{
                // pets: allPets,
                page: 'campgrounds'
              });
            }
         }
      });
  }
});

// ADDING A NEW CAMPGROUND
router.post('/', Mid.isLoggedIn, (req, res) => {
  console.log(req.body.images);
  var encodedAddress = encodeURIComponent(req.body.location);
  geocoder.geocode(req.body.location, (err, data) => {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var owner = {username: req.user.username, id: req.user._id};
    var newPet = {
      name: req.body.name,
      images: req.body.images,
      description: req.body.description,
      age: req.body.age,
      breed: req.body.breed,
      type: req.body.type,
      owner: owner,
      location: location,
      locationStr: encodedAddress,
      lat: lat,
      lng: lng
    }
    console.log(newPet);
    Pet.create(newPet, (err, newPetAdded) => {
      if (err) {
        console.log(err);
      }else {
        console.log('Newly added pet');
        res.redirect('pets');
      }
    });
  });
});

// router.get('/memorials', (req, res) => {
//   res.render('memorial', {pageHeader: "PetsLiveOn Memorials",pets: Pets});
// });


// RENDER CAMPGROUND ADD FORM
router.get('/new', Mid.isLoggedIn, (req, res) => {
  res.render('pets/new');
});

// RENDER SINGLE SITE ON PAGE
router.get('/:id', (req, res) => {
 Pet.findById(req.params.id).populate('comments').exec(( err, onePet) => {
   if (err) {
     console.log(err);
   }else {
     res.render('pets/show', {pet: onePet})
   }
 });
});

// EDIT CAMPGROUND
router.get('/:id/edit', Mid.checkCampgroundOwnership, (req, res) => {
  Pet.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    }else {
      res.render('pets/edit', {campground: campground});
    }
  });
});

// UPDATE CAMPGROUND ROUTE
router.put('/:id', (req, res) => {
  geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newData = {
      name: req.body.name,
      images: req.body.images,
      description: req.body.description,
      price: req.body.price,
      location: location,
      lat: lat,
      lng: lng
    };
    Pet.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/pets/" + campground._id);
        }
    });
  });
});

// DELETE CAMPGROUND
router.delete('/:id', Mid.checkCampgroundOwnership, (req, res) => {
  Pet.findByIdAndRemove(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirec('/pets');
    }else {
      res.redirect('/pets')
    }
  });
});



module.exports = router;
