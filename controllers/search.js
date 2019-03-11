const express = require('express');
const router = express.Router();
const db = require('../models');
const passport = require('../config/passportConfig')
const isLoggedIn = require('../middleware/isLoggedIn');
const request = require('request');
require('dotenv').config(); // reads our .env file, saves into process.env.(name of variable)
const goodreadsKey = process.env.GOODREADS_KEY;

// for goodreads API which is XML, using JS module to convert XML into JSON
const { DOMParser } = require('xmldom');
const xmlToJSON = require('xmltojson');
xmlToJSON.stringToXML = (string) => new DOMParser().parseFromString(string, 'text/xml');

// GET /search/new
router.get('/new/', isLoggedIn, function(req, res) {
  res.render('search/new');
});

// GET /search/show takes you to show results of search, calls isLoggedIn middleware
router.get('/', isLoggedIn, function(req, res) {
  if (req.query.name) {
    let googlebooksUrl = `https://www.googleapis.com/books/v1/volumes?q=intitle:${req.query.name}&printType=books&maxResults=40` 
    // let goodreadsUrl = `https://www.goodreads.com/search.xml?key=${goodreadsKey}&q=${req.query.name}`
    console.log('your google url is..............:):)........', googlebooksUrl)
    // Use request to call the API
    request(googlebooksUrl, function(error, response, body) {
      var googleBooksOriginal = JSON.parse(body).items;
      var googleBooks = [];
      // if (JSON.parse(body).items) {
        googleBooksOriginal.forEach(function(book, index) {
          if (book.volumeInfo.industryIdentifiers) {
            if (book.volumeInfo.industryIdentifiers[0].type != 'OTHER') {
              googleBooks[index] = {
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
      // } else {
      //   req.flash('error','Please try again');
      //   res.redirect('/search/new');
      // }
      function compare(a, b) {
        if (a.ratingsCount > b.ratingsCount)
          return -1;
        if (a.ratingsCount < b.ratingsCount)
          return 1;
        return 0;
        }
      googleBooks.sort(compare);
      // request(goodreadsUrl, function(error, response, body) {
      //   var amazonBooksOriginal = xmlToJSON.parseString(body).GoodreadsResponse[0].search[0].results[0].work;
      //   var amazonBooks = [];
      //   amazonBooksOriginal.forEach(function(book, index) {
      //     amazonBooks[index] = {
      //       ratingsCount: book.ratings_count[0]._text,
      //       reviewsCount: book.text_reviews_count[0]._text,
      //       publicationYear: book.original_publication_year[0]._text,
      //       averageRating: book.average_rating[0]._text,
      //       title: book.best_book[0].title[0]._text,
      //       author: book.best_book[0].author[0].name[0]._text,
      //       imageUrl: book.best_book[0].image_url[0]._text
      //     }
      //   });
      // })
      console.log(googleBooks);
      res.render('search/show', {googleBooks: googleBooks});
      // res.json(googleBooks);
    });
  } else if (req.query.author) {
    let googlebooksUrl = `https://www.googleapis.com/books/v1/volumes?q=inauthor:"${req.query.author}"&printType=books&maxResults=40` 
    // let goodreadsUrl = `https://www.goodreads.com/search.xml?key=${goodreadsKey}&q="${req.query.author}"`
    console.log('your google url is ', googlebooksUrl);
    // Use request to call the API
    request(googlebooksUrl, function(error, response, body) {
      console.log(JSON.parse(body).items)
      var googleBooksOriginal = JSON.parse(body).items;
      var googleBooks = [];
      // if (JSON.parse(body).items) {
        googleBooksOriginal.forEach(function(book, index) {
          if (book.volumeInfo.industryIdentifiers) {
            if (book.volumeInfo.industryIdentifiers[0].type != 'OTHER') {
              googleBooks[index] = {
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
      // } else {
      //   req.flash('error','Please try again');
      //   res.redirect('/search/new');
      // }
      function compare(a, b) {
        if (a.ratingsCount > b.ratingsCount)
          return -1;
        if (a.ratingsCount < b.ratingsCount)
          return 1;
        return 0;
        }
      googleBooks.sort(compare);
      // request(goodreadsUrl, function(error, response, body) {
      //   var amazonBooksOriginal = xmlToJSON.parseString(body).GoodreadsResponse[0].search[0].results[0].work;
      //   var amazonBooks = [];
      //   amazonBooksOriginal.forEach(function(book, index) {
      //     amazonBooks[index] = {
      //       ratingsCount: book.ratings_count[0]._text,
      //       reviewsCount: book.text_reviews_count[0]._text,
      //       publicationYear: book.original_publication_year[0]._text,
      //       averageRating: book.average_rating[0]._text,
      //       title: book.best_book[0].title[0]._text,
      //       author: book.best_book[0].author[0].name[0]._text,
      //       imageUrl: book.best_book[0].image_url[0]._text
      //     }
      //   });
      // })
      res.render('search/show', {googleBooks: googleBooks});
      // res.json(googleBooks);
    });
  } else if (req.query.category) {
    let googlebooksUrl = `https://www.googleapis.com/books/v1/volumes?q=subject:"${req.query.category}"&printType=books&maxResults=40` 
    // let goodreadsUrl = `https://www.goodreads.com/search.xml?key=${goodreadsKey}&q="${req.query.category}"`
    console.log('your googlebooks url is ', googlebooksUrl);
    // Use request to call the API
    request(googlebooksUrl, function(error, response, body) {
      var googleBooksOriginal = JSON.parse(body).items;
      var googleBooks = [];
      googleBooksOriginal.forEach(function(book, index) {
        // if (JSON.parse(body).items) {
          googleBooksOriginal.forEach(function(book, index) {
            if (book.volumeInfo.industryIdentifiers) {
              if (book.volumeInfo.industryIdentifiers[0].type != 'OTHER') {
                googleBooks[index] = {
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
        // } else {
        //   req.flash('error','Please try again');
        //   res.redirect('/search/new');
        // }
      function compare(a, b) {
        if (a.ratingsCount > b.ratingsCount)
          return -1;
        if (a.ratingsCount < b.ratingsCount)
          return 1;
        return 0;
        }
      googleBooks.sort(compare);
      // request(goodreadsUrl, function(error, response, body) {
      //   var amazonBooksOriginal = xmlToJSON.parseString(body).GoodreadsResponse[0].search[0].results[0].work;
      //   var amazonBooks = [];
      //   amazonBooksOriginal.forEach(function(book, index) {
      //     amazonBooks[index] = {
      //       ratingsCount: book.ratings_count[0]._text,
      //       reviewsCount: book.text_reviews_count[0]._text,
      //       publicationYear: book.original_publication_year[0]._text,
      //       averageRating: book.average_rating[0]._text,
      //       title: book.best_book[0].title[0]._text,
      //       author: book.best_book[0].author[0].name[0]._text,
      //       imageUrl: book.best_book[0].image_url[0]._text
      //     }
      //   });
      // })
      res.render('search/show', {googleBooks: googleBooks});
      // res.json(googleBooks);
    });
  });
  } else {
    console.log('no input field filled in');
  }
});



module.exports = router;