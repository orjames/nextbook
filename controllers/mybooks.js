const express = require('express');;
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

// GET /mybooks/index takes you to your collection of books calls isLoggedIn middleware, includes ratings and reviews 
router.get('/', isLoggedIn, function(req, res) {
  db.user.findAll({
    where: {id: req.user.id},
    include: [db.book, db.review]
  })
  .then(user => {
    var books = user[0].get({plain: true}).books;
    var reviews = user[0].get({plain: true}).reviews;
    res.render('mybooks', {books: books, reviews: reviews, user: req.user});
  }).catch(function(error) {
    res.status(500).render('main/error')
  })
})

// GET /mybooks/new
router.get('/new/:isbn', isLoggedIn, function(req, res) {
  let googlebooksUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${req.params.isbn}&printType=books` 
  // let goodreadsUrl = `https://www.goodreads.com/search.xml?key=${goodreadsKey}&q=${req.params.isbn}`
  // console.log('your amazon url is ', goodreadsUrl);
  // Use request to call the API
  request(googlebooksUrl, function(error, response, body) {
    var googleBooksOriginal = JSON.parse(body).items ? JSON.parse(body).items[0] : 'no API for the book'
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
    //   })
    // })
    res.render('mybooks/new', {book: book});
    // res.JSON(book);
  });
});

// POST /mybooks - receive the name of a book title etc of a book then add it to the books table
router.post('/', isLoggedIn, function(req, res) {
  db.user.findById(parseInt(req.user.dataValues.id), {include: [db.review]}).then(function (user) {
    user.createBook({
        book_link: req.body.book_link,
        title: req.body.title,
        author: req.body.author,
        isbn: req.body.isbn,
        genre: req.body.genre
    }).then(function (book) {
      book.createReview({
        rating: req.body.rating,
        text: req.body.review,
        userId: req.user.id
      })
    }).then(function(review) {
      res.redirect('/mybooks')
    })
  });
});

// GET /mybooks/edit takes you to a page to edit a review isLoggedIn middleware
router.get('/:bookId/edit/', isLoggedIn, function(req, res) {
  db.book.findAll({
    where: {id: req.params.bookId},
    include: [db.review]
  })
  .then(books => {
    res.render('mybooks/edit', {books: books, user: req.user});
  })
  .catch(function(error) {
    res.status(500).render('main/error')
  })
});

// PUT /mybooks - edit a review from mybooks
router.put('/:review', isLoggedIn, function(req, res) {
  db.user.findById(parseInt(req.user.id), { include: [db.review, db.book] }).then(function (user) {
    db.review.update({ text: req.body.text, rating: req.body.rating },
      { where: { bookId: req.body.review, userId: req.user.id } }
    ).then(function() {
      res.redirect('/mybooks')
    })
  })
})

// DELETE /mybooks - delete a genre from mybooks index
router.delete('/:isbn', isLoggedIn, function(req, res) {
  db.user.findById(parseInt(req.user.id), { include: [db.review, db.book] }).then(function (user) {
    var books = user.get({plain: true}).books;
    var bodyIsbn = req.body.isbn
    var bookIsbns = books.map(function(book) {
      return book.isbn
    })
    if (bookIsbns.includes(bodyIsbn)) {
      db.book.destroy({
        where: {isbn: bodyIsbn}
      }).then(function(user) {
        db.review.destroy({
          where: {
            userId: user,
            bookId: books[0].userBook.bookId
          }
        })
      }).then(function() {
        res.redirect('/mybooks')
      })
    } else {
      res.status(500).render('main/error')
    }
  })
})

module.exports = router;