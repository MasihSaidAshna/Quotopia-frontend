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

async function fetchCategoryName(genreID) {
    const URLCategoryName = `http://localhost:8080/api/category/name?genreID=${encodeURIComponent(genreID)}`;

    try {
        const response = await fetch(URLCategoryName);
        if (!response.ok) {
            throw new Error('Failed to fetch category name. Status: ' + response.status);
        }
        const data = await response.json();
        return data || { categoryName: 'Default Category' }; // Provide a default value in case of failure
    } catch (error) {
        console.error('There was a problem fetching the category name:', error);
        return { categoryName: 'Default Category' }; // Provide a default value in case of failure
    }
}

function displayQuotes(categoryName, quotes) {
    const quotesContainer = document.getElementById('quotesContainer');
    const categoryNameElement = document.getElementById('categoryName');

    if (!Array.isArray(quotes) || quotes.length === 0) {
        quotesContainer.textContent = 'No quotes found for this genre.';
        return;
    }

    // Update category name in the h1 element
    categoryNameElement.textContent = `${categoryName} Quotes`;

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
        const [categoryInfo, quotes] = await Promise.all([
            fetchCategoryName(genreId),
            fetchQuotesByGenreId(genreId)
        ]);

        displayQuotes(categoryInfo.categoryName, quotes);
    } catch (error) {
        console.error('Error fetching quotes:', error);
    }
});