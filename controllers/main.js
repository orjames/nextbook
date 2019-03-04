const express = require('express');
const router = express.Router();
const db = require('../models');
const passport = require('../config/passportConfig')
const isLoggedIn = require('../middleware/isLoggedIn');
const request = require('request');

// for goodreads API which is XML, using JS module to convert XML into JSON
const { DOMParser } = require('xmldom');
const xmlToJSON = require('xmltojson');
xmlToJSON.stringToXML = (string) => new DOMParser().parseFromString(string, 'text/xml');


// GET /main/index takes you to main page of app calls isLoggedIn middleware
router.get('/index', isLoggedIn, function(req, res) {
  res.render('main/index')
})


module.exports = router;