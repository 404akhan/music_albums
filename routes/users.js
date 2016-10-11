var express = require('express');
var router = express.Router();
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/users');

router.get('/register', function(req, res, next) {
  res.render('users/register');
});

router.get('/login', function(req, res, next) {
  res.render('users/login');
});

router.post('/register', function(req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var password2 = req.body.password2;

  req.checkBody('name', 'Empty name').notEmpty();
  req.checkBody('email', 'Empty email').notEmpty();
  req.checkBody('email', 'Valid email required').isEmail();
  req.checkBody('password', '6 to 20 characters required').len(6, 20);
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors(true);

  if(errors) {
    for(var key in errors) {
      req.flash('error_' + key, errors[key].msg);
    }

    res.redirect('/users/register');
  } else {

    User.getUserByEmail(email, function(err, user) {

      if(err) {
        req.flash('error', 'Database error occured, please try again');
        res.redirect('/users/register');

        return;
      }

      if(user) {
        req.flash('error', 'Such email already exists');
        res.redirect('/users/register');

        return;
      }

      var newUser = new User({
        name: name,
        email: email,
        password: password
      });

      User.createUser(newUser, function() {
        req.flash('success_msg', 'Your account has been created');
        res.redirect('/users/login');
      });

    });
  }
});

router.post('/login',
  passport.authenticate('local', {failureRedirect: '/users/login', failureFlash: true}),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    req.flash('success', 'You are now logged in');
    res.redirect('/');
  }
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    User.getUserByEmail(email, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect email' });
      }
      User.comparePassword(password, user.password, function(err, isMatch) {
        if (err) { return done(err); }
        if(!isMatch) {
          return done(null, false, { message: 'Incorrect password' });
        }
        return done(null, user);
      });
    });
  }
));

router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'You are now logged out');
  res.redirect('/users/login');
});

module.exports = router;