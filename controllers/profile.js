// app.put('/profile', upload.single('myFile'), function(req, res) {
//   cloudinary.uploader.upload(req.file.path, function(result) {
//     db.photo.update({
//       link: result.url
//       }, {where: {userId: req.user.id}}
//     ).then(function(photo, created) {
//         res.redirect('/profile');
//     });
//   });
// });