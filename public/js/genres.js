var genres

document.addEventListener('DOMContentLoaded', function() {
  genres = document.querySelectorAll(".genre");
  genres.forEach(function (genre) {
    genre.addEventListener('click', addToGenres)
  });
});


// AJAX to update user's genres
function addToGenres(e) {
  var genre = e.currentTarget.innerText; //event.target is the target of the event(click), or the genre that was clicked on
  e.target.style.display = 'none';
  // Default options are marked with *
    return fetch('/genres', {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        credentials: "include", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
            // "Content-Type": "application/x-www-form-urlencoded",
        },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
        body: JSON.stringify({genre}), // body data type must match "Content-Type" header
    }).then(function() {
      // document.getElementById()
      window.location='/genres';
    })
}