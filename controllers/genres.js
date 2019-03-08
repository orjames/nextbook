const express = require('express');
const router = express.Router();
const db = require('../models');
const passport = require('../config/passportConfig')
const isLoggedIn = require('../middleware/isLoggedIn');
const methodOverride = require('method-override');

// GET /genres/index takes you to your genres calls isLoggedIn middleware
router.get('/', isLoggedIn, function(req, res) {
  db.user.findAll({
    where: {id: req.user.id},
    include: [db.genre]
  })
  .then(user => {
    var genres = user[0].get({plain: true}).genres;
    var genreNames = genres.map(function(genre) {
      return genre.name;
    })
    res.render('genres', {genreNames: genreNames, user: req.user});
  })
  .catch(function(error) {
    res.status(500).render('main/error')
  })
});


// POST /genres - post a new genre into genres
router.post('/', isLoggedIn, function(req, res) {
  db.user.findById(parseInt(req.user.id), { include: [db.genre] }).then(function (user) {
    var genres = user.get({plain: true}).genres;
    var genreNames = genres.map(function(genre) {
      return genre.name
    })
    if (genreNames.includes(req.body.genre)) {
      res.send('already added genre')
    } else {
      user.createGenre({
          name: req.body.genre,
      }).then(function(genre) {
        res.redirect('/genres')
      })
    }
  })
})

// DELETE /genres - delete a genre from genres index
router.delete('/:genre', isLoggedIn, function(req, res) {
  db.user.findById(parseInt(req.user.id), { include: [db.genre] }).then(function (user) {
    var genres = user.get({plain: true}).genres;
    var bodyGenre = req.body.genre
    var genreNames = genres.map(function(genre) {
      return genre.name
    })
    if (genreNames.includes(bodyGenre)) {
      db.genre.destroy({
        where: {name: bodyGenre}
      }).then(function() {
        res.redirect('/genres')
      })
    } else {
      console.log("can't delete");
    }
  })
})

module.exports = router;