document.addEventListener('DOMContentLoaded', async () => {
    try {
        const genres = await fetchAllGenres();
        console.log('Fetched data:', genres);
        populateDropdownWithGenres(genres);

        const dropdownItems = document.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('click', () => {
                const selectedGenre = item.textContent.trim();
                navigateToQuotesPage(selectedGenre);
            });
        });
    } catch (error) {
        console.error('There was a problem with fetching genres:', error);
    }
});

async function fetchAllGenres() {
    const URLGenres = "http://localhost:8080/api/genre";

    try {
        const response = await fetch(URLGenres);
        if (!response.ok) {
            throw new Error('Network response was not ok. Status: ' + response.status);
        }
        const data = await response.json();
        const genres = data || [];
        return genres;
    } catch (error) {
        console.error('There was a problem with fetching genres:', error);
        return [];
    }
}

function populateDropdownWithGenres(genres) {
    const genreDropdown = document.getElementById('genreDropdown');

    if (!genreDropdown || !Array.isArray(genres) || genres.length === 0) {
        console.error('Dropdown element not found or genres empty');
        return;
    }

    function handleGenreItemClick(genre) {
        return function () {
            navigateToQuotesPage(genre.genreName);
        };
    }

    genres.forEach(genre => {
        const genreItem = document.createElement('div');
        genreItem.classList.add('dropdown-item');
        genreItem.textContent = genre.genreName;

        genreItem.addEventListener('click', handleGenreItemClick(genre));

        genreDropdown.appendChild(genreItem);
    });
}

function navigateToQuotesPage(genre) {
    window.location.href = `Category.html?genre=${encodeURIComponent(genre)}`;
}

