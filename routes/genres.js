var express = require('express');
var router = express.Router();

var Genre = require('../models/genres.js');

router.use(function(req, res, next) {
  if(!req.user) {
    res.redirect('/users/login');
  }
  next();
});

router.get('/', function(req, res, next) {
  Genre.find(function(err, data) {
    if(err) {
      res.render('genres/index');
    } else {
      res.render('genres/index', {genres: data});
    }
  });
});

router.get('/add', function(req, res, next) {
  res.render('genres/add');
});

router.post('/add', function(req, res, next) {
  var genre = {
    name: req.body.name
  };

  var newGenre = new Genre(genre);

  newGenre.save(function(err, data) {
    if(err) {

      req.flash('error_msg', 'Database Error Occured');
      res.redirect('/genres');

    } else {

      req.flash('success_msg', 'Genre Saved');
      res.redirect('/genres');

    }
  });

});

router.get('/edit/:id', function(req, res, next) {
  var id = req.params.id;

  Genre.findById(id, function(err, data) {
    if(err) {
      req.flash('error_msg', 'Database error occured');
      res.redirect('/genres');
    } else {
      res.render('genres/edit', {genre: data, id: id});
    }
  });
});

router.post('/edit/:id', function(req, res, next) {
  var id = req.params.id;
  var name = req.body.name;

  Genre.findByIdAndUpdate(id, {name: name}, function(err, data) {
    if(err) {

      req.flash('error_msg', 'Database Error Occured');
      res.redirect('/genres');

    } else {

      req.flash('success_msg', 'Genre Updated');
      res.redirect('/genres');

    }
  });
});

router.delete('/delete/:id', function(req, res, next) {
  var id = req.params.id;

  Genre.findByIdAndRemove(id, function(err, data) {
    if(err) {

      req.flash('error_msg', 'Database Error Occured');
      res.send(200);

    } else {

      req.flash('success_msg', 'Genre Deleted');
      res.send(200);

    }
  });
});


module.exports = router;