const express = require('express');;
const router = express.Router();
const db = require('../models');
const passport = require('../config/passportConfig')
const isLoggedIn = require('../middleware/isLoggedIn');
const request = require('request');
require('dotenv').config(); // reads our .env file, saves into process.env.(name of variable)
const goodreadsKey = process.env.GOODREADS_KEY;


// GET /favorite/index takes you to your collection of favorites books calls isLoggedIn middleware 
router.get('/', isLoggedIn, function(req, res) {
  db.favorite.findAll({})
  .then(books => {
    res.render('favorite', {books: books, user: req.user});
    // res.json(books);
  }).catch(function(error) {
    res.status(500).render('main/error')
  })
})

// POST /mybooks - receive the name of a book title etc of a book then add it to the books table
router.post('/', isLoggedIn, function(req, res) {
  console.log('your req.body is ..........................:):)', req.body);
  db.user.findById(parseInt(req.user.dataValues.id)).then(function (user) {
    db.favorite.findOrCreate({
        book_link: req.body.book_link,
        title: req.body.title,
        author: req.body.author,
        isbn: req.body.isbn,
        genre: req.body.genre
    }).then(function(book) {
      res.redirect('/mybooks')
    })
  });
});

// DELETE /mybooks - delete a genre from mybooks index
router.delete('/:isbn', isLoggedIn, function(req, res) {
  db.user.findById(parseInt(req.user.id), { include: [ db.favorite] }).then(function (user) {
    var favorites = user.get({plain: true}).favorites;
    var bodyIsbn = req.body.isbn
    var favoriteIsbns = favorites.map(function(favorite) {
      return favorite.isbn
    })
    if (favoriteIsbns.includes(bodyIsbn)) {
      db.favorite.destroy({
        where: {isbn: bodyIsbn}
      }).then(function() {
        res.redirect('/mybooks')
      })
    } else {
      console.log("can't delete");
    }
  })
})

module.exports = router;