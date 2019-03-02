const express = require('express');
const router = express.Router();
const db = require('../models');
const passport = require('../config/passportConfig')

// GET to the signup page
router.get('/signup', function(req, res) {
  res.render('auth/signup');
});

// POST route to /signup
router.post('/signup', function(req, res) {
  db.user.findOrCreate({
    where: {email: req.body.email},
    defaults: {
      name: req.body.name,
      password: req.body.password
    }
  }).spread(function(user, created) {
    console.log('inside signup, user created:', created);
    if (created) { //success, so add authentication in this step
      console.log('user created');
      passport.authenticate('local', { //what type of auth are we doing = local
        successRedirect: '/',
        successFlash: 'Account created and logged in' // sends message to the front
      })(req, res); //iife immediately invoked function expression
    } else { // failure, redirect to signup page
      console.log('Email already exists.');
      req.flash('error','Email already exists');
      res.redirect('/auth/signup');
    }
  }).catch(function(error) {
    res.redirect('/auth/signup');
  })
})

// GET to login page
router.get('/login', function(req, res) {
  res.render('auth/login');
});

// POST to login
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  successFlash: 'You have logged in!',
  failureRedirect: '/auth/login',
  failureFlash: 'Invalid username and/or password'
}));

// GET to logout
router.get('/logout', function(req, res) {
  req.logout(); // takes user out and invalidates the session
  req.flash('success', 'you have logged out');
  res.redirect('/');
});

module.exports = router;