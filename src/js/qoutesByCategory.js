document.addEventListener('DOMContentLoaded', async () => {
    const selectedGenre = new URLSearchParams(window.location.search).get('genre');

    if (!selectedGenre) {
        console.error('No genre selected');
        return;
    }

    document.getElementById('selectedGenre').textContent = `Quotes in ${selectedGenre} category`;

    try {
        const quotes = await fetchQuotesByGenre(selectedGenre);
        displayQuotes(quotes);
    } catch (error) {
        console.error('There was a problem fetching quotes by genre:', error);
    }
});

async function fetchQuotesByGenre(genre) {
    const URLQuoteByGenre = `http://localhost:8080/api/quote?genre=${encodeURIComponent(genre)}`;

    try {
        const response = await fetch(URLQuoteByGenre);
        if (!response.ok) {
            throw new Error('Failed to fetch quotes. Status: ' + response.status);
        }
        const data = await response.json();
        return data.quotes || [];
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
        listItem.textContent = quote.quoteText;
        quotesList.appendChild(listItem);
    });

    quotesContainer.appendChild(quotesList);
}