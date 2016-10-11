var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: './public/images/uploads'});

var Genre = require('../models/genres');
var Album = require('../models/albums');

router.use(function(req, res, next) {
  if(!req.user) {
    res.redirect('/users/login');
  }
  next();
});

router.get('/', function(req, res, next) {
  Album.find(function(err, data) {
    if(err) {
      res.render('albums/index');
    } else {
      res.render('albums/index', {albums: data});
    }
  });
});

router.get('/add', function(req, res, next) {

  Genre.find(function(err, data) {

    res.render('albums/add', {genres: data});
  });
});

router.post('/add', upload.single('cover'), function(req, res, next) {
  if(req.file) {
    var cover= req.file.filename;
  } else {
    var cover = 'noimage.jpg';
  }

  var album = {
    artist: req.body.artist,
    title: req.body.title,
    genre: req.body.genre,
    info: req.body.info,
    year: req.body.year,
    label: req.body.label,
    tracks: req.body.tracks,
    cover: cover,
  };

  var newAlbum = new Album(album);

  newAlbum.save(function(err, data) {
    if(err) {
      req.flash('error_msg', 'Database error occured');
      res.redirect('/albums/add');
    } else {
      req.flash('success_msg', 'Album is added');
      res.redirect('/albums');
    }
  });

});

router.get('/details/:id', function(req, res) {
  var id = req.params.id;

  Album.findById(id, function(err, data) {
    if(err) {
      res.render('albums/details');
    } else {
      res.render('albums/details', {album: data, id: id});
    }
  });
});

router.get('/edit/:id', function(req, res, next) {
  var id = req.params.id;

  Genre.find(function(err, genres) {
    Album.findById(id, function(err, album) {
      if(err) {
        req.flash('error_msg', 'Database error occured');
        res.redirect('/albums');
      } else {
        res.render('albums/edit', {album: album, id: id, genres: genres});
      }
    });
  });
});

router.post('/edit/:id', upload.single('cover'), function(req, res, next) {
  var id = req.params.id;

  if(req.file) {
    var cover= req.file.filename;

    var album = {
      artist: req.body.artist,
      title: req.body.title,
      genre: req.body.genre,
      info: req.body.info,
      year: req.body.year,
      label: req.body.label,
      tracks: req.body.tracks,
      cover: cover,
    };

  } else {

    var album = {
      artist: req.body.artist,
      title: req.body.title,
      genre: req.body.genre,
      info: req.body.info,
      year: req.body.year,
      label: req.body.label,
      tracks: req.body.tracks
    };

  }

  Album.findByIdAndUpdate(id, album, function(err, data) {
    if(err) {
      req.flash('error_msg', 'Database error occured');
      res.redirect('/albums/edit/' + id);
    } else {
      req.flash('success_msg', 'Album is updated');
      res.redirect('/albums');
    }
  });

});

router.delete('/delete/:id', function(req, res, next) {
  var id = req.params.id;

  Album.findByIdAndRemove(id, function(err, data) {
    if(err) {

      req.flash('error_msg', 'Database Error Occured');
      res.send(200);

    } else {

      req.flash('success_msg', 'Album Deleted');
      res.send(200);

    }
  });
});


module.exports = router;