var mongoose = require('mongoose');

var AlbumSchema = mongoose.Schema({
  artist: String,
  title: String,
  genre: String,
  info: String,
  year: Number,
  label: String,
  tracks: Number,
  cover: String
});

var Album = mongoose.model('Album', AlbumSchema);

module.exports = Album;