document.addEventListener('DOMContentLoaded', async () => {
    try {
        const categories = await fetchAllCategories(); // Fetch categories
        console.log('Fetched categories:', categories);
        populateDropdownWithCategories(categories);
    } catch (error) {
        console.error('There was a problem with fetching categories:', error);
    }
});

function populateDropdownWithCategories(categories) {
    const searchBarCategory = document.getElementById('searchBarCategory');
    const suggestionsCategory = document.getElementById('suggestionsCategory');

    if (!searchBarCategory || !suggestionsCategory || !Array.isArray(categories) || categories.length === 0) {
        console.error('Search bar or suggestions element not found or categories empty');
        return;
    }

    searchBarCategory.addEventListener('input', function () {
        const query = this.value.toLowerCase();
        const matchedCategories = categories.filter(category => category.categoryName.toLowerCase().includes(query));
        renderSuggestions(matchedCategories, suggestionsCategory);
    });

    searchBarCategory.addEventListener('change', async function () {
        const selectedCategory = this.value;
        if (selectedCategory !== 'All') {
            try {
                const quotes = await fetchQuotesByCategory(selectedCategory); // Fetch quotes by selected category
                displayQuotes(quotes);
            } catch (error) {
                console.error('There was a problem with fetching quotes by category:', error);
            }
        } else {
            clearQuoteDisplay(); // Clear the quote display
        }
    });

    // Rest of your event listeners, closeSuggestions function, etc.
}

function displayQuotes(quotes) {
    const quoteDisplay = document.getElementById('quoteDisplay');
    if (!quoteDisplay) return;

    quoteDisplay.innerHTML = ''; // Clear previous quotes

    quotes.forEach(quote => {
        const quoteElement = document.createElement('p');
        quoteElement.textContent = `${quote.quoteText} - ${quote.author}`;
        quoteDisplay.appendChild(quoteElement);
    });
}

function clearQuoteDisplay() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    if (!quoteDisplay) return;

    quoteDisplay.innerHTML = ''; // Clear the quote display
}

// Fetch quotes based on selected category
async function fetchQuotesByCategory(category) {
    const URLQuotesByCategory = `http://localhost:8080/api/quotes?category=${category}`; // Adjust this URL

    const response = await fetch(URLQuotesByCategory);
    if (!response.ok) {
        throw new Error('Network response was not ok. Status: ' + response.status);
    }
    const data = await response.json();
    return data.quotes || [];
}



