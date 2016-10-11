var mongoose = require('mongoose');

var GenreSchema = mongoose.Schema({
  name: String
});

var Genre = mongoose.model('Genre', GenreSchema);

module.exports = Genre;

