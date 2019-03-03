const express = require('express');
const router = express.Router();
const db = require('../models');
const passport = require('../config/passportConfig')
const isLoggedIn = require('../middleware/isLoggedIn');

// GET /main/index takes you to my genres page calls isLoggedIn middleware 
router.get('/index', isLoggedIn, function(req, res) {
  res.render('genres/index');
});


module.exports = router;