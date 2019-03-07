module.exports = function(req, res, next) {
  if(!req.user) { // if there is no user attached to the request
    res.redirect('/');
  } else {
    res.redirect('/main/index');
  }
}