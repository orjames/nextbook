const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../models');

// serializing is turning into a format that can be sent over the network
// serialize basically means to turn it into a string
// de-serialize means turn it into something used on network


passport.serializeUser(function(user, callback) {
  callback(null, user.id);
});


passport.deserializeUser(function(id, callback) {
  db.user.findById(id).then(function(user) {
    callback(null, user);
  }).catch(callback);
});

// when you put keyword new you're instantiating a class in ObjOrientedProgramming
// like building a car from a blueprint or a house from plans

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, function(email, password, callback) { //have received an email address, password
  db.user.findOne({
    where: {email: email}
  }).then(function(user) {
    if (!user || !user.validPassword(password) ) { // if there's no user OR there is a user but its an invalid password, validPassword() was defined in models -> User
      callback(null, false); // false meaning there is no user OR wrong password
    } else {
      callback(null, user); // return the user if they authenticate, then passport knows what to do with that
    }
  }).catch(callback);
}))

module.exports = passport;



















