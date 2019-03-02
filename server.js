const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const passport = require('./config/passportConfig');
const session = require('express-session');
const flash = require('connect-flash');
const isLoggedIn = require('./middleware/isLoggedIn');
const helmet = require('helmet');
require('dotenv').config(); // reads our .env file, saves into process.env.(name of variable)
const port = process.env.PORT || 3001;
const SequelizeStore = require('connect-session-sequelize')(session.Store); // passing the store into the node module so its passing it into sequelize
const db = require('./models');
const app = express();

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);
app.use(helmet());

// create a session store
const sessionStore = new SequelizeStore({
  db: db.sequelize,
  expiration: 30 * 60 * 1000 // 30 minute expiration time
})

// configuring a session
app.use(session({ //function that takes an options object
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: sessionStore
}));

// use this line once to setup the store table
// sessionStore.sync();

// this must come after the session and before passport
app.use(flash());

// telling passport to use the session to indicate that a user is logged in
// the Id of the user goes into the session
app.use(passport.initialize());
app.use(passport.session());

// anonymous middleware function that attaches flash messages to the response, hits every route
app.use(function(req, res, next) {
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  // res.locals.title = req.title; maybe work if you want a different title but ahve to assign req.title on the routes you want
  next();
});

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile');
});

app.use('/auth', require('./controllers/auth'));

const server = app.listen(port, function() {
  console.log(`spinning on ${port}`)
})

module.exports = server;
