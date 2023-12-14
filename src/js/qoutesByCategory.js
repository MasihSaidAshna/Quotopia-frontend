async function fetchQuotesByGenreId(genreID) {
    const URLQuoteByGenre = `http://localhost:8080/api/quote/byGenre?genreID=${encodeURIComponent(genreID)}`;

    try {
        const response = await fetch(URLQuoteByGenre);
        if (!response.ok) {
            throw new Error('Failed to fetch quotes. Status: ' + response.status);
        }
        const data = await response.json();
        return data || [];
    } catch (error) {
        console.error('There was a problem fetching quotes by genre:', error);
        return [];
    }
}

function displayQuotes(quotes) {
    const quotesContainer = document.getElementById('quotesContainer');

    if (!Array.isArray(quotes) || quotes.length === 0) {
        quotesContainer.textContent = 'No quotes found for this genre.';
        return;
    }

    const quotesList = document.createElement('ul');
    quotes.forEach(quote => {
        const listItem = document.createElement('li');

        const quoteText = document.createElement('p');
        quoteText.textContent = `Quote: ${quote.quoteText}`;

        const authorInfo = document.createElement('p');
        authorInfo.textContent = `Author: ${quote.author.authorName}`;

        const genreInfo = document.createElement('p');
        genreInfo.textContent = `Genre: ${quote.genre.genreName}`;

        listItem.appendChild(quoteText);
        listItem.appendChild(authorInfo);
        listItem.appendChild(genreInfo);

        quotesList.appendChild(listItem);
    });

    quotesContainer.appendChild(quotesList);
}

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const genreId = urlParams.get('genreID');

    if (!genreId) {
        console.error('No genre ID found in the URL.');
        return;
    }

    try {
        const quotes = await fetchQuotesByGenreId(genreId);
        displayQuotes(quotes);
    } catch (error) {
        console.error('Error fetching quotes:', error);
    }
});
