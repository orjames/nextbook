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
  db.user.findAll({
    where: {id: req.user.id},
    include: [db.favorite]
  })
  .then(user => {
    var favorites = user[0].get({plain: true}).favorites;
    res.render('favorite', {favorites: favorites, user: req.user});
  })
  .catch(function(error) {
    res.status(500).render('main/error')
  })
});

// POST /mybooks - receive the name of a book title etc of a book then add it to the books table
router.post('/', isLoggedIn, function(req, res) {
  console.log('your req.body is ..........................:):)', req.body);
  db.user.findById(parseInt(req.user.dataValues.id), { include: [db.favorite] }).then(function (user) {
    console.log('user.get({plain: true}) ..........................:):)', user.get({plain: true}));
    var favorites = user.get({plain: true}).favorites;
    
    var favoriteIsbns = favorites.map(function(favorite) {
      return favorite.isbn
    })
    console.log('favoriteIsbns is...........................', favoriteIsbns)
    console.log('req.body.favorite is...........................', req.body.favorite)
    console.log('if they match you shouldnt be able to add o favorites')
    if (favoriteIsbns.includes(req.body.favorite)) {  
      res.send('already added favorite')
    } else {
      user.createFavorite({
          book_link: req.body.book_link,
          title: req.body.title,
          author: req.body.author,
          isbn: req.body.isbn,
          genre: req.body.genre
      }).then(function(book) {
        res.redirect('/favorite')
      })
    }
  });
});


// DELETE /mybooks - delete a genre from mybooks index
router.delete('/:isbn', isLoggedIn, function(req, res) {
  db.user.findById(parseInt(req.user.id), { include: [ db.favorite] }).then(function (user) {
    var favorites = user.get({plain: true}).favorites;
    var bodyIsbn = req.body.isbn
    var favoriteIsbns = favorites.map(favorite =>
      favorite.isbn
    )
    if (favoriteIsbns.includes(bodyIsbn)) {
      db.favorite.destroy({
        where: {isbn: bodyIsbn}
      }).then(function() {
        res.redirect('/favorite')
      })
    } else {
      console.log("can't delete......💩 error");
    }
  })
})

module.exports = router;