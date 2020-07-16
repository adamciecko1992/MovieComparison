let leftMovie;
let rightMovie;

/////////////////////////////////////////////////////////////////////////////////
const onMovieSelect = async(movie, summaryElement, side) => {
    const response = await axios.get("http://www.omdbapi.com/", {
        params: {
            apikey: "e22051a3",
            i: movie.imdbID
        }
    });

    summaryElement.innerHTML = movieTemplate(response.data);
    side === "left" ? (leftMovie = response.data) : (rightMovie = response.data);
    if (leftMovie && rightMovie) {
        runComparison();
    }
    // return response.data;
};
////////////////////////////////////////////////////////////////////////////
const runComparison = () => {
    const leftSideStats = document.querySelectorAll(
        "#left-summary .notification"
    );
    const rightSideStats = document.querySelectorAll(
        "#right-summary .notification"
    );

    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index];

        const leftSideValue = leftStat.dataset.value;
        const rightSideValue = rightStat.dataset.value;

        if (rightSideValue > leftSideValue) {
            leftStat.classList.remove("is-primary");
            leftStat.classList.add("is-warning");
        } else {
            rightStat.classList.remove("is-primary");
            rightStat.classList.add("is-warning");
        }
    });
};

////////////////////////////////////////////////////////////////////////////////
const movieTemplate = movieDetail => {
    let count = 0;
    const awards = movieDetail.Awards.split(" ").reduce((prev, word) => {
        const value = parseInt(word);
        if (isNaN(value)) {
            return prev;
        } else {
            return prev + value;
        }
    }, 0);

    const dollars = parseInt(
        movieDetail.BoxOffice.replace(/\$/g, "").replace(/,/g, "")
    );
    const metaScore = parseInt(movieDetail.Metascore);
    const imbdRating = parseFloat(movieDetail.imdbRating);
    const imbdVotes = parseFloat(movieDetail.imdbVotes.replace(/\$/g, ""));

    return `
    <article class="media">
        <figure class ="media-left">
            <p class="image">
                <img src="${movieDetail.Poster}"
            </p>
        </figure>
        <div class ="media-content">
            <div class ="content">
                <h1>${movieDetail.Title}</h1>
                <h4>${movieDetail.Genre}</h4>
                <p>${movieDetail.Plot}</p>
            </div>
        </div>     
    </article>
    <article class="notification is-primary" data-value=${awards}>
    <p class="title">${movieDetail.Awards}</p>
    <p class="subtitle">Awards</p>
    </article>
    <article class="notification is-primary" data-value=${dollars}>
    <p class="title">${movieDetail.BoxOffice}</p>
    <p class="subtitle">Box Office</p>
    </article>
    <article class="notification is-primary" data-value =${metaScore}>
    <p class="title">${movieDetail.Metascore}</p>
    <p class="subtitle">Metascore</p>
    </article>
    <article class="notification is-primary" data-value =${imbdRating}>
    <p class="title">${movieDetail.imdbRating}</p>
    <p class="subtitle">imbd Rating</p>
    </article>
    <article class="notification is-primary" data-value =${imbdVotes}>
    <p class="title">${movieDetail.imdbVotes}</p>
    <p class="subtitle">imdb Votes</p>
    </article>
    `;
};

/////////////////////////////////////////////////////////////////////////////////
const autoCompleteConfig = {
    renderOption(movie) {
        const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
        return `
        <img src="${imgSrc}"/>
        ${movie.Title}(${movie.Year})
        `;
    },

    inputValue(movie) {
        return movie.Title;
    },
    async fetchData(searchTerm) {
        const response = await axios.get("http://www.omdbapi.com/", {
            params: {
                apikey: "e22051a3",
                s: searchTerm
            }
        });

        if (response.data.Error) {
            return [];
        }
        console.log("response.data.Search: ", response.data.Search);
        return response.data.Search;
    }
};

////////////////////////////////////////////////////////////////
createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector("#left-autocomplete"),
    onOptionSelect(movie) {
        const tutorial = document.querySelector(".tutorial");
        tutorial.classList.add("is-hidden");
        onMovieSelect(movie, document.querySelector("#left-summary"), "left");
    }
});

createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector("#right-autocomplete"),
    onOptionSelect(movie) {
        const tutorial = document.querySelector(".tutorial");
        tutorial.classList.add("is-hidden");
        onMovieSelect(movie, document.querySelector("#right-summary"), "right");
    }
});