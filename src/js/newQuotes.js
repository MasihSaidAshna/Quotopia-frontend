// Fetch top 4 new quotes from the backend
fetch('http://localhost:8080/api/quote/top4new', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        // Add any additional headers if needed
    },
})
    .then(response => response.json())
    .then(quotes => {
        const quoteListContainer = document.getElementById('quoteList');

        quotes.forEach(quote => {
            const quoteCard = document.createElement('div');
            quoteCard.className = 'quote-card';
            quoteCard.innerHTML = `
                    <p>${quote.quoteText}</p>
                    <p class="author" style="color: #1062b4">- ${quote.author ? quote.author.authorName : 'Unknown'}</p>
                `;
            quoteListContainer.appendChild(quoteCard);
        });
    })
    .catch(error => console.error('Error fetching quotes:', error));
