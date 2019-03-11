const express = require('express');
const router = express.Router();
const db = require('../models');
const passport = require('../config/passportConfig')
const isLoggedIn = require('../middleware/isLoggedIn');
const request = require('request');
require('dotenv').config(); // reads our .env file, saves into process.env.(name of variable)
const goodreadsKey = process.env.GOODREADS_KEY;

// lodash utilization
  // Load the full build.
  var _ = require('lodash');
  // Load the core build.
  var _ = require('lodash/core');
  // Load the FP build for immutable auto-curried iteratee-first data-last methods.
  var fp = require('lodash/fp');
  // Load method categories.
  var array = require('lodash/array');
  var object = require('lodash/fp/object');
  // Cherry-pick methods for smaller browserify/rollup/webpack bundles.
  var at = require('lodash/at');
  var curryN = require('lodash/fp/curryN');

const async = require('async');
let genres=[];
let requestIndexes = [ 0, 40, 80, 120] // if more searches desired, add more numbers in this array, increments of 40

// GET /main/index takes you to show reccomended books search, calls isLoggedIn middleware
router.get('/', isLoggedIn, function(req, res) {
  db.user.findById(parseInt(req.user.id), { include: [db.genre] }).then(function (user) {
    let unmappedGenres = user.get({plain: true}).genres;
    genres = unmappedGenres.map( genre => encodeURI(genre.name) );
    return genres;
  }).then(function() {
    const requests = requestIndexes.map(function(index) {
      return function(callback) {
        let url = `https://www.googleapis.com/books/v1/volumes?q=category:${genres[0]}&printType=books&maxResults=40&startIndex=${index}`
        // console.log('url is', url)
        request (url, function(error, res, body) {
          if (JSON.parse(body).items) {
            let googleBooks = JSON.parse(body).items;
            let books = googleBooks.map(function(book) {
              // filters results
              if (book.volumeInfo.industryIdentifiers) {
                if (book.volumeInfo.industryIdentifiers[0].type != 'OTHER') {
                  return {
                    bookLink: (book.selfLink) ? book.selfLink : 'no link',
                    title: (book.volumeInfo.title) ? book.volumeInfo.title : 'no title',
                    author: (book.volumeInfo.authors) ? book.volumeInfo.authors.join(' ') : 'no author',
                    publicationYear: (book.volumeInfo.publishedDate) ? book.volumeInfo.publishedDate.split('-')[0] : 'no publication',
                    description: (book.volumeInfo.description) ? book.volumeInfo.description : 'no description',
                    isbn: (book.volumeInfo.industryIdentifiers) ? book.volumeInfo.industryIdentifiers[0].identifier : 'no isbn',
                    averageRating: (book.volumeInfo.averageRating) ? book.volumeInfo.averageRating : 'no ratings',
                    ratingsCount: (book.volumeInfo.ratingsCount) ? book.volumeInfo.ratingsCount : 0,
                    category: (book.volumeInfo.categories) ? book.volumeInfo.categories.join(' ') : 'no category',
                    imageUrl: (book.volumeInfo.imageLinks) ? book.volumeInfo.imageLinks.thumbnail : 'no image url',
                    previewLink: (book.volumeInfo.previewLink) ? book.volumeInfo.previewLink : 'no preview link',
                    price: (book.saleInfo.retailPrice) ? book.saleInfo.retailPrice.amount : 'not for sale'
                  }
                }
              }
            })
            callback(null, books)
          } else {
            callback(null, [])
          }
        })
      }
    })
    async.parallel(async.reflectAll(requests), function(error, results) {
      // flatten data
      // get rid of bad data
      // get rid of duplicate data
      let books = _.compact(_.flatten(results.map( r => r.value)))
      
      // sorting the data by popularity
      function compare(a, b) {
        if (a.ratingsCount > b.ratingsCount)
          return -1;
        if (a.ratingsCount < b.ratingsCount)
          return 1;
        return 0;
      }
      books.sort(compare);
      res.render( 'main/index', {books});
      // res.json(flattenedResults);
    })
  })
})




module.exports = router;