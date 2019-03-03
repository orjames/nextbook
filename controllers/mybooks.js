const express = require('express');
const router = express.Router();
const db = require('../models');
const passport = require('../config/passportConfig')
const isLoggedIn = require('../middleware/isLoggedIn');


// GET /mybooks/index takes you to your collection of books calls isLoggedIn middleware 
router.get('/index', isLoggedIn, function(req, res) {
  res.render('mybooks/index');
});



module.exports = router;