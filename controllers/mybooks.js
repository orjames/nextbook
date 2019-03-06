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

// GET /mybooks/index takes you to your collection of books calls isLoggedIn middleware, includes ratings and reviews 
router.get('/', isLoggedIn, function(req, res) {
  db.book.findAll({
    include: [db.rating, db.review]
  })
  .then(books => {
    res.render('mybooks', {books: books, user: req.user});
    // res.json(books);
  })
  .catch(function(error) {
    res.status(500).render('main/error')
  })
});

// GET /mybooks/new
router.get('/new/:isbn', isLoggedIn, function(req, res) {
  console.log('isbn is :) :)', req.params.isbn);
  let googlebooksUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${req.params.isbn}&printType=books` 
  let goodreadsUrl = `https://www.goodreads.com/search.xml?key=JtQuDTA0kMEyRYfz91eVQ&q=${req.params.isbn}`
  console.log('your amazon url is ', goodreadsUrl);
  console.log('your google url is ', googlebooksUrl);
  // Use request to call the API
  request(googlebooksUrl, function(error, response, body) {
    var googleBooksOriginal = JSON.parse(body).items[0];
    var book = {};
    book = {
      bookLink: (googleBooksOriginal.selfLink) ? googleBooksOriginal.selfLink : 'no link',
      title: (googleBooksOriginal.volumeInfo.title) ? googleBooksOriginal.volumeInfo.title : 'no title',
      author: (googleBooksOriginal.volumeInfo.authors) ? googleBooksOriginal.volumeInfo.authors.join(' ') : 'no author',
      publicationYear: (googleBooksOriginal.volumeInfo.publishedDate) ? googleBooksOriginal.volumeInfo.publishedDate.split('-')[0] : 'no publication',
      description: (googleBooksOriginal.volumeInfo.description) ? googleBooksOriginal.volumeInfo.description : 'no description',
      isbn: (googleBooksOriginal.volumeInfo.industryIdentifiers) ? googleBooksOriginal.volumeInfo.industryIdentifiers[0].identifier : 'no isbn',
      averageRating: (googleBooksOriginal.volumeInfo.averageRating) ? googleBooksOriginal.volumeInfo.averageRating : 'no',
      ratingsCount: (googleBooksOriginal.volumeInfo.ratingsCount) ? googleBooksOriginal.volumeInfo.ratingsCount : 'no',
      category: (googleBooksOriginal.volumeInfo.categories) ? googleBooksOriginal.volumeInfo.categories.join(' ') : 'no category',
      imageUrl: (googleBooksOriginal.volumeInfo.imageLinks) ? googleBooksOriginal.volumeInfo.imageLinks.thumbnail : 'no image url',
      previewLink: (googleBooksOriginal.volumeInfo.previewLink) ? googleBooksOriginal.volumeInfo.previewLink : 'no preview link',
      price: (googleBooksOriginal.saleInfo.retailPrice) ? googleBooksOriginal.saleInfo.retailPrice.amount : 'not for sale'
    }
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
      res.render('mybooks/new', {book: book, amazonBooks: amazonBooks});
      // res.JSON(book);
    })
  });
});


// POST /mybooks - receive the name of a book title etc of a book then add it to the books table
router.post('/', isLoggedIn, function(req, res) {
  db.user.findById(parseInt(req.user.dataValues.id)).then(function (user) {
    user.createBook({
        book_link: req.body.book_link,
        title: req.body.title,
        author: req.body.author,
        isbn: req.body.isbn,
        genre: req.body.genre
    }).then(function (book) {
      book.createRating({
        rating: req.body.rating,
      })  
      book.createReview({
            review: req.body.review,
      })
      book.createGenre({
        genre: req.body.genre
      })
    }).then(function (genre) {
      res.redirect('/mybooks'); 
    });
  });
});

// router.post('/', isLoggedIn, function(req, res) {
//   db.user.findById(parseInt(req.user.dataValues.id)).then(function (user) {
//     user.createBook({
//       book_link: req.body.book_link,
//       title: req.body.title,
//       author: req.body.author,
//       isbn: req.body.isbn,
//       genre: req.body.genre,
//       rating: { rating: req.body.rating },
//       review: { review: req.body.review },
//       genre: { genre: req.body.genre }
//     }, {
//       include: [{
//         association: book.rating,
//         association: book.review,
//         association: book.genre,
//       }]
//     }).then(function (genre) {
//       res.redirect('/mybooks');
//     });
//   });
// })

router.post('/', isLoggedIn, function(req, res) {
  db.user.findById(parseInt(req.user.dataValues.id)).then(function (user) {
    user.createBook({
        book_link: req.body.book_link,
        title: req.body.title,
        author: req.body.author,
        isbn: req.body.isbn,
        genre: req.body.genre
    }).then(function (book) {
      book.createRating({
        rating: req.body.rating,
      })  
      book.createReview({
            review: req.body.review,
      })
      book.createGenre({
        genre: req.body.genre
      })
    }).then(function (genre) {
      res.redirect('/mybooks'); 
    });
  });
});


module.exports = router;