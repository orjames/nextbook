module.exports = function(req, res, next) {
  if(!req.user) { // if there is no user attached to the request
    res.render('index');
  } else {
    res.redirect('/main/');
  }
}