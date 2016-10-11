var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

  if(!req.user) {
    res.locals.page = '/';
    res.render('index');
  } else {
    res.redirect('/albums');
  }
});

module.exports = router;