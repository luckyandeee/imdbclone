// global element to store Favourite Movies 
let favoriteMovies = []; 

// if elseif condition to check the location of page to call required functions.
if (window.location.pathname === "/index.html") {
  document
    .getElementById("searchGroup")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      performSearch();
    });
}else if (window.location.pathname === '/favmovie.html') {
    renderFavoriteMovies(); 
    // here it calls for fav Movie function which renders the fav movies from the list Fav movies array which are stored in local storage 
  }else{
    const header = document.querySelector('header');
    header.style.background="rgba(245, 197, 25, 0.5)";
  }
// fetch to call the data using API 
function performSearch() {
  const apiKey = "6dd38eca"; 
  const movieTitle = document.getElementById("searchInput").value.trim();
  const moviesList = document.getElementById("moviesList");
  moviesList.innerHTML = "";

  fetch(`http://www.omdbapi.com/?s=${movieTitle}&apikey=${apiKey}`)
    .then((response) => response.json())
    .then((data) => {
      moviesList.innerHTML = "";
      if (data.Search) {
        data.Search.forEach((movie) => {
          const movieCard = createMovieCard(movie);
          moviesList.appendChild(movieCard);
        });

        // Event listener for clicking on a movie card for movie details
        document.querySelectorAll(".movie-card").forEach((movieCard) => {
          movieCard.addEventListener("click", function (event) {
            event.stopPropagation();
            const imdbID = this.querySelector("img").dataset.imdbid;
            window.location.href = `moviedesc.html?imdbID=${imdbID}`;
          });
        });

        // Event listener for clicking "Add to Favorites" button
        document.querySelectorAll(".movie-card button").forEach((button) => {
          button.addEventListener("click", function (event) {
            event.stopPropagation();
          });
        });
      } else {
        // if there are no movies with given string
        const noMoviesImage = document.createElement("img");
        const noMovieHeading = document.createElement("h1");
        noMovieHeading.textContent = "No Movies Found";
        noMoviesImage.src = "no-movies-found.jpg";
        noMoviesImage.alt = "No movie found";
        moviesList.appendChild(noMoviesImage);
        moviesList.appendChild(noMovieHeading);
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}
// the movie card is created here 
function createMovieCard(movie) {
  const movieCard = document.createElement("div");
  movieCard.classList.add("movie-card");

  const moviePoster = document.createElement("img");
  moviePoster.src = movie.Poster;
  moviePoster.alt = movie.Title;
  moviePoster.dataset.imdbid = movie.imdbID; // Set dataset attribute for imdbID
  movieCard.appendChild(moviePoster);

  const movieTitle = document.createElement("h3");
  movieTitle.textContent = movie.Title;
  movieCard.appendChild(movieTitle);

  const addToFavoritesBtn = document.createElement("button");
  addToFavoritesBtn.textContent = "Add to Favorites";
  addToFavoritesBtn.addEventListener("click", function () {
    addToFavorites(movie);
  });
  movieCard.appendChild(addToFavoritesBtn);

  return movieCard;
}

// Add movie to favorites
function addToFavorites(movie) {
    favoriteMovies.push(movie);
    localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies));
  }
// in movieDesc.html the detailed movie details are rendered from here
function renderMovieDetails(movie) {
  const movieDetailsContainer = document.getElementById("movieDetails");
  movieDetailsContainer.innerHTML = "";
  const movieBackGround = document.getElementById('movieBackGround');
  movieBackGround.style.backgroundImage = `url('${movie.Poster}')`;
  const movieContainer = `
  <div class="movieDetailImage">
  <img src="${movie.Poster}" alt="${movie.Title}"  height="400px">
  </div>
  <div class="details">
      <h2>${movie.Title} (${movie.Year})</h2>
      <p><strong>Rated:</strong> ${movie.Rated}</p>
      <p><strong>Released:</strong> ${movie.Released}</p>
      <p><strong>Runtime:</strong> ${movie.Runtime}</p>
      <p><strong>Genre:</strong> ${movie.Genre}</p>
      <p><strong>Director:</strong> ${movie.Director}</p>
      <p><strong>Writer:</strong> ${movie.Writer}</p>
      <p><strong>Actors:</strong> ${movie.Actors}</p>
      <p><strong>Plot:</strong> ${movie.Plot}</p>
      <p><strong>Language:</strong> ${movie.Language}</p>
      <p><strong>Country:</strong> ${movie.Country}</p>
      <p><strong>Awards:</strong> ${movie.Awards}</p>
  </div>
`;

movieDetailsContainer.innerHTML = movieContainer;
}
// Render favorite movies
function renderFavoriteMovies() {
    const storedFavoriteMovies = localStorage.getItem('favoriteMovies');
    if (storedFavoriteMovies) {
      favoriteMovies = JSON.parse(storedFavoriteMovies);
      const favoriteMoviesContainer = document.getElementById("favoriteMoviesList");
      favoriteMoviesContainer.innerHTML = "";
  
      favoriteMovies.forEach(movie => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
          <div class="listEleMovie">
            <img src="${movie.Poster}">
            <div class="details">
              <h2>${movie.Title}</h2>
              <p>(${movie.Year})</p>
            </div>
          </div>`;
        
        // Add event listener to each movie item
        listItem.addEventListener("click", function() {
            // Redirect to movie details page with IMDb ID
            window.location.href = `moviedesc.html?imdbID=${movie.imdbID}`;
        });
        
        favoriteMoviesContainer.appendChild(listItem);
      });
    }
}

  