const port                  = process.env.PORT || 5000,
      fs                    = require('fs');

const express               = require('express'),
      bodyParser            = require('body-parser'),
      mongoose              = require('mongoose'),
      passport              = require('passport'),
      LocalStrategy         = require('passport-local'),
      passportLocalMongoose = require('passport-local-mongoose'),
      medthodOverride       = require('method-override'),
      flash                 = require('connect-flash');

const Pet                   = require('./models/pet'),
      Comments              = require('./models/comment'),
      Forum                 = require('./models/forum'),
      Vendor                = require('./models/vendor'),
      User                  = require('./models/user'),
      seedDB                = require('./seed'),
      app                   = express();

var  db_URI                 = process.env.DATABASEURL || 'mongodb://localhost:27017/PLO-DB';
// seedDB();


console.log(process.env.DATABASEURL);

function getDate(){
  return new Date().getFullYear();
}
// DATABASE CONNECTION
mongoose.Promise = global.Promise;
mongoose.connect(db_URI , {
  useMongoClient: true
}, (err, db) => {
  if (err) {
    console.log(err);
  }
  console.log('Now connected to DB');
  db = db;
});

// EXPRESS MIDDLEWARE
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.use(medthodOverride('_method'));
app.use(flash());
app.set('view engine', 'ejs');

app.use(require('express-session')({
  secret: "fuzzywuzzyorwashe",
  resave: false,
  saveUninitialized: false
}));

app.locals.moment = require('moment');

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});


// CREATE LOGGER
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) console.log('Error with server.log');
  });
   next();
});



var mainRoutes = require('./routes/index')
var petRoutes = require('./routes/pets');
var forumRoutes = require('./routes/forum');
var forumCommentRoutes = require('./routes/forumComments');
var commentRoutes = require('./routes/comments');
var vendorRoutes = require('./routes/vendor');


app.use('/', mainRoutes);
app.use('/pets', petRoutes);
app.use('/forum', forumRoutes);
app.use('/forum/:id/comments', forumCommentRoutes);
app.use('/pets/:id/comments', commentRoutes);
app.use('/vendors', vendorRoutes);


app.listen(port, () => {
  console.log(`App now runnning on port ${port}`);
});
