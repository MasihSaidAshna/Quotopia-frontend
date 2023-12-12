document.addEventListener('DOMContentLoaded', async () => {
    try {
        const genres = await fetchAllGenres();
        populateDropdownWithGenres(genres);
    } catch (error) {
        console.error('There was a problem with fetching genres:', error);
    }

    const searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', async () => {
        const selectedGenre = document.getElementById('searchInput').value;
        try {
            const filteredQuotes = await filterQuotesByGenre(selectedGenre);
            console.log(filteredQuotes);
            // Display or manipulate the filtered quotes as needed
        } catch (error) {
            console.error('There was a problem with fetching quotes by genre:', error);
        }
    });

    // Event listener for dropdown genre selection
    const genreDropdown = document.getElementById('genreDropdown');
    if (genreDropdown) {
        genreDropdown.addEventListener('click', event => {
            const selectedGenre = event.target.textContent;
            document.getElementById('searchInput').value = selectedGenre;
        });
    } else {
        console.error('Dropdown element not found');
    }
});

function populateDropdownWithGenres(genres) {
    const genreDropdown = document.getElementById('genreDropdown');
    if (!genreDropdown) {
        console.error('Dropdown element not found');
        return;
    }

    genreDropdown.innerHTML = '';
    genres.forEach(genre => {
        const genreItem = document.createElement('a');
        genreItem.classList.add('dropdown-item');
        genreItem.href = '#';
        genreItem.textContent = genre;
        genreDropdown.appendChild(genreItem);
    });
}


async function fetchAllGenres() {
    const URLGenres = "http://localhost:8080/api/genre";

    try {
        const response = await fetch(URLGenres);
        if (!response.ok) {
            throw new Error('Network response was not ok. Status: ' + response.status);
        }
        const data = await response.json();

        return data.genre; // Assuming the API returns an array of genres
    } catch (error) {
        console.error('There was a problem with fetching genres:', error);
        return [];
    }
}

async function filterQuotesByGenre(genre) {
    const URLQuoteByGenre = `http://localhost:8080/api/quote?genre=${encodeURIComponent(genre)}`;

    try {
        const response = await fetch(URLQuoteByGenre);
        if (!response.ok) {
            throw new Error('Network response was not ok. Status: ' + response.status);
        }
        const data = await response.json();
        return data.quotes; // Assuming the API returns an array of quotes for the given genre
    } catch (error) {
        console.error('There was a problem with fetching quotes by genre:', error);
        return [];
    }
}