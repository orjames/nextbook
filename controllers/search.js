const express = require('express');
const router = express.Router();
const db = require('../models');
const passport = require('../config/passportConfig')
const isLoggedIn = require('../middleware/isLoggedIn');

// GET /search/new
router.get('/new', isLoggedIn, function(req, res) {
  res.render('search/new');
});






module.exports = router;