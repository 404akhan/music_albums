var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var UserSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

var User = mongoose.model('User', UserSchema);

User.getUserById = function(id, callback) {
  User.findById(id, callback);
};

User.getUserByEmail = function(email, callback) {
  var query = {email: email};
  User.findOne(query, callback);
};

User.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    callback(err, isMatch);
  });
};

User.createUser = function(newUser, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};

module.exports = User;

