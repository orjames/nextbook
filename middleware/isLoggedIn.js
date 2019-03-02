// Middleware to verify that a user is authenticated


module.exports = function(req, res, next) {
  if (!req.user) { // if there is no user attached to the request
    req.flash('error', 'you must be logged in to access that page');
    res.redirect('/auth/login');
  } else {
    next();
  }
};