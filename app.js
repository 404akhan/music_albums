var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var passport = require('passport');

mongoose.connect('mongodb://localhost/db_music');

// route files
var routes = require('./routes/index');
var albums = require('./routes/albums');
var genres = require('./routes/genres');
var users = require('./routes/users');

// init app
var app = express();

// view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// logger
app.use(logger('dev'));

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// handle sessions
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// passport
app.use(passport.initialize());
app.use(passport.session());

// validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// static folder
app.use(express.static(path.join(__dirname, 'public')));

// connect flash
app.use(flash());

// global vars
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');

  // form
  res.locals.error_name = req.flash('error_name');
  res.locals.error_email = req.flash('error_email');
  res.locals.error_password = req.flash('error_password');
  res.locals.error_password2 = req.flash('error_password2');

  // page
  res.locals.page = '';

  next();
});

app.get('*', function(req, res, next) {
  res.locals.user = req.user || null;
  next();
});

app.use(function(req, res, next) {
  console.log('user is: ', req.user);
  next();
});

// routes
app.use('/', routes);
app.use('/albums', albums);
app.use('/genres', genres);
app.use('/users', users);

// set port
app.set('port', (process.env.PORT || 3000));

// run server
app.listen(app.get('port'), function() {
  console.log('Server started on port: ' + app.get('port'));
});