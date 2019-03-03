const express = require('express');
const router = express.Router();
const db = require('../models');
const passport = require('../config/passportConfig')
const isLoggedIn = require('../middleware/isLoggedIn');
const request = require('request');

// GET /main/index takes you to main page of app calls isLoggedIn middleware 
// router.get('/index', isLoggedIn, function(req, res) {
//   res.render('main/index');
// });

// GET /main/index takes you to main page of app calls isLoggedIn middleware
router.get('/index', isLoggedIn, function(req, res) {
  let googlebooksUrl = 'https://www.googleapis.com/books/v1/volumes?q=harry+potter';
  let goodreadsUrl = 'https://www.goodreads.com/search.xml?key=JtQuDTA0kMEyRYfz91eVQ&q=Ender%27s+Game'
  // Use request to call the API
  request(googlebooksUrl, function(error, response, body) {
    var googleBooks = JSON.parse(body).items;
    res.render('main/index', {googleBooks: googleBooks});
  });
});


// // GET to API to view individual pokemon, show route
// router.get('/:name', function(req, res) {
//   let pokemonUrl = 'http://pokeapi.co/api/v2/pokemon/' + req.params.name.toLowerCase();
//   // Use request to call the API
//   request(pokemonUrl, function(error, response, body) {
//     var pokemon = JSON.parse(body);
//     let speciesURL = pokemon.species.url;
//     request(speciesURL, function(error, response, body) {
//       var species = JSON.parse(body);
//       let evolutionChainURL = species.evolution_chain.url;
//       request(evolutionChainURL, function(error, response, body) {
//         var evolution = JSON.parse(body);
//         if (evolution.chain.evolves_to.length) {
//           var evolvedName = evolution.chain.evolves_to[0].evolves_to[0].species.name;
//           let evolvedAPI = 'http://pokeapi.co/api/v2/pokemon/' + evolvedName;
//           request(evolvedAPI, function(error, response, body) {
//             var evolvedPokemon =  JSON.parse(body);
//             res.render('pokemon/show', {pokemon, species, evolution, evolvedPokemon});
//           });
//         };
//       });
//     });
//   });
// });


module.exports = router;