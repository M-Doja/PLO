var express = require('express');
var Pets = require('../seed');
var router = express.Router();
console.log('Router here:');
console.log(Pets);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'PetsLiveOn', pageHeader: 'PetsLiveOn', page: 'Home' });
});

/* GET about page. */
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'PetsLiveOn', pageHeader: 'About PetsLiveOn', page: 'About' });
});

/* GET community page. */
router.get('/community', function(req, res, next) {
  res.render('community', { title: 'PetsLiveOn', pageHeader: 'Join the PetsLiveOn Community', page: 'Community' });
});

/* GET memorial page. */
router.get('/memorial', function(req, res, next) {
  res.render('memorial', {
    title: 'PetsLiveOn',
    pets: Pets,
    pageHeader: 'View PetsLiveOn Memorials',
    page: 'Memorial'
  });
});

/* GET Profile page. */
router.get('/profile', function(req, res, next) {
  res.render('profile',{title: 'PetsLiveOn', pageHeader: 'Your PetsLiveOn Profile Here', page: 'Profile' });
});

/* GET Login page. */
router.get('/login', function(req, res, next) {
  res.render('login',{title: 'PetsLiveOn', pageHeader: 'Log-In', page: 'Login' });
});

/* GET Registration page. */
router.get('/register', function(req, res, next) {
  res.render('register',{title: 'PetsLiveOn', pageHeader: 'Sign Up', page: 'Registration' });
});

module.exports = router;
