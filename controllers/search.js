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

// GET /search/new
router.get('/new', isLoggedIn, function(req, res) {
  res.render('search/new');
});

// POST /search/show takes you to main page of app calls isLoggedIn middleware
router.get('/', isLoggedIn, function(req, res) {
  console.log('your req query is', req.query)
  if (req.query.name) {
    let googlebooksUrl = `https://www.googleapis.com/books/v1/volumes?q=intitle:${req.query.name}&printType=books` 
    let goodreadsUrl = `https://www.goodreads.com/search.xml?key=JtQuDTA0kMEyRYfz91eVQ&q=${req.query.name}`
    console.log('your amazon url is ', goodreadsUrl);
    console.log('your google url is ', googlebooksUrl);
    // Use request to call the API
    request(googlebooksUrl, function(error, response, body) {
      var googleBooksOriginal = JSON.parse(body).items;
      var googleBooks = [];
      googleBooksOriginal.forEach(function(book, index) {
        googleBooks[index] = {
          bookLink: (book.selfLink) ? book.selfLink : 'no link',
          title: (book.volumeInfo.title) ? book.volumeInfo.title : 'no title',
          author: (book.volumeInfo.authors) ? book.volumeInfo.authors : 'no author',
          publicationYear: (book.volumeInfo.publishedDate) ? book.volumeInfo.publishedDate : 'no publication',
          description: (book.volumeInfo.description) ? book.volumeInfo.description : 'no description',
          ISBN13: (book.volumeInfo.industryIdentifiers[0].industryIdentifier) ? book.volumeInfo.industryIdentifiers[0].industryIdentifier : 'no ISBN13',
          averageRating: (book.volumeInfo.averageRating) ? book.volumeInfo.averageRating : 'no',
          ratingsCount: (book.volumeInfo.ratingsCount) ? book.volumeInfo.ratingsCount : 'no',
          category: (book.volumeInfo.categories) ? book.volumeInfo.categories : 'no category',
          imageUrl: (book.volumeInfo.imageLinks.thumbnail) ? book.volumeInfo.imageLinks.thumbnail : 'no image url',
          previewLink: (book.volumeInfo.previewLink) ? book.volumeInfo.previewLink : 'no preview link',
          price: (book.saleInfo.retailPrice) ? book.saleInfo.retailPrice.amount : 'not for sale'
        }
      })
      request(goodreadsUrl, function(error, response, body) {
        var amazonBooksOriginal = xmlToJSON.parseString(body).GoodreadsResponse[0].search[0].results[0].work;
        var amazonBooks = [];
        amazonBooksOriginal.forEach(function(book, index) {
          amazonBooks[index] = {
            ratingsCount: book.ratings_count[0]._text,
            reviewsCount: book.text_reviews_count[0]._text,
            publicationYear: book.original_publication_year[0]._text,
            averageRating: book.average_rating[0]._text,
            title: book.best_book[0].title[0]._text,
            author: book.best_book[0].author[0].name[0]._text,
            imageUrl: book.best_book[0].image_url[0]._text
          }
        });
        res.render('main/index', {googleBooks: googleBooks, amazonBooks: amazonBooks});
        // res.json(googleBooks);
      })
    });
  } else if (req.query.author) {
    let googlebooksUrl = `https://www.googleapis.com/books/v1/volumes?q=inauthor:${req.query.author}&printType=books` 
    let goodreadsUrl = `https://www.goodreads.com/search.xml?key=JtQuDTA0kMEyRYfz91eVQ&q=${req.query.author}`
    console.log('your amazon url is ', goodreadsUrl);
    // Use request to call the API
    request(googlebooksUrl, function(error, response, body) {
      var googleBooksOriginal = JSON.parse(body).items;
      var googleBooks = [];
      googleBooksOriginal.forEach(function(book, index) {
        googleBooks[index] = {
          bookLink: (book.selfLink) ? book.selfLink : 'no link',
          title: (book.volumeInfo.title) ? book.volumeInfo.title : 'no title',
          author: (book.volumeInfo.authors) ? book.volumeInfo.authors : 'no author',
          publicationYear: (book.volumeInfo.publishedDate) ? book.volumeInfo.publishedDate : 'no publication',
          description: (book.volumeInfo.description) ? book.volumeInfo.description : 'no description',
          ISBN13: (book.volumeInfo.industryIdentifiers[0].industryIdentifier) ? book.volumeInfo.industryIdentifiers[0].industryIdentifier : 'no ISBN13',
          averageRating: (book.volumeInfo.averageRating) ? book.volumeInfo.averageRating : 'no',
          ratingsCount: (book.volumeInfo.ratingsCount) ? book.volumeInfo.ratingsCount : 'no',
          category: (book.volumeInfo.categories) ? book.volumeInfo.categories : 'no category',
          imageUrl: (book.volumeInfo.imageLinks.thumbnail) ? book.volumeInfo.imageLinks.thumbnail : 'no image url',
          previewLink: (book.volumeInfo.previewLink) ? book.volumeInfo.previewLink : 'no preview link',
          price: (book.saleInfo.retailPrice) ? book.saleInfo.retailPrice.amount : 'not for sale'
        }
      })
      request(goodreadsUrl, function(error, response, body) {
        var amazonBooksOriginal = xmlToJSON.parseString(body).GoodreadsResponse[0].search[0].results[0].work;
        var amazonBooks = [];
        amazonBooksOriginal.forEach(function(book, index) {
          amazonBooks[index] = {
            ratingsCount: book.ratings_count[0]._text,
            reviewsCount: book.text_reviews_count[0]._text,
            publicationYear: book.original_publication_year[0]._text,
            averageRating: book.average_rating[0]._text,
            title: book.best_book[0].title[0]._text,
            author: book.best_book[0].author[0].name[0]._text,
            imageUrl: book.best_book[0].image_url[0]._text
          }
        });
        res.render('main/index', {googleBooks: googleBooks, amazonBooks: amazonBooks});
        // res.json(googleBooks);
      })
    });
  } else if (req.query.category) {
    let googlebooksUrl = `https://www.googleapis.com/books/v1/volumes?q=subject:${req.query.category}&printType=books` 
    let goodreadsUrl = `https://www.goodreads.com/search.xml?key=JtQuDTA0kMEyRYfz91eVQ&q=${req.query.category}`
    console.log('your amazon url is ', goodreadsUrl);
    // Use request to call the API
    request(googlebooksUrl, function(error, response, body) {
      var googleBooksOriginal = JSON.parse(body).items;
      var googleBooks = [];
      googleBooksOriginal.forEach(function(book, index) {
        googleBooks[index] = {
          bookLink: (book.selfLink) ? book.selfLink : 'no link',
          title: (book.volumeInfo.title) ? book.volumeInfo.title : 'no title',
          author: (book.volumeInfo.authors) ? book.volumeInfo.authors : 'no author',
          publicationYear: (book.volumeInfo.publishedDate) ? book.volumeInfo.publishedDate : 'no publication',
          description: (book.volumeInfo.description) ? book.volumeInfo.description : 'no description',
          ISBN13: (book.volumeInfo.industryIdentifiers[0].industryIdentifier) ? book.volumeInfo.industryIdentifiers[0].industryIdentifier : 'no ISBN13',
          averageRating: (book.volumeInfo.averageRating) ? book.volumeInfo.averageRating : 'no',
          ratingsCount: (book.volumeInfo.ratingsCount) ? book.volumeInfo.ratingsCount : 'no',
          category: (book.volumeInfo.categories) ? book.volumeInfo.categories : 'no category',
          imageUrl: (book.volumeInfo.imageLinks.thumbnail) ? book.volumeInfo.imageLinks.thumbnail : 'no image url',
          previewLink: (book.volumeInfo.previewLink) ? book.volumeInfo.previewLink : 'no preview link',
          price: (book.saleInfo.retailPrice) ? book.saleInfo.retailPrice.amount : 'not for sale'
        }
      })
      request(goodreadsUrl, function(error, response, body) {
        var amazonBooksOriginal = xmlToJSON.parseString(body).GoodreadsResponse[0].search[0].results[0].work;
        var amazonBooks = [];
        amazonBooksOriginal.forEach(function(book, index) {
          amazonBooks[index] = {
            ratingsCount: book.ratings_count[0]._text,
            reviewsCount: book.text_reviews_count[0]._text,
            publicationYear: book.original_publication_year[0]._text,
            averageRating: book.average_rating[0]._text,
            title: book.best_book[0].title[0]._text,
            author: book.best_book[0].author[0].name[0]._text,
            imageUrl: book.best_book[0].image_url[0]._text
          }
        });
        res.render('main/index', {googleBooks: googleBooks, amazonBooks: amazonBooks});
        // res.json(googleBooks);
      })
    });
  } else {
    console.log('no input field filled in');
  }
});



module.exports = router;