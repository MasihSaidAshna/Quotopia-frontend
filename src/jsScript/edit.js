document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'http://localhost:8080/api/quote'; // Replace with your backend URL
    const quoteForm = document.getElementById('quoteForm');

    // Function to fetch quotes and populate the table
    function fetchAndPopulateQuotes() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => makeQuoteRows(data))
            .catch(error => handleFetchError(error));
    }

    // Function to create table rows for quotes
    function makeQuoteRows(quotes) {
        const tableBody = document.getElementById('quoteTableBody');
        tableBody.innerHTML = ''; // Clear previous rows

        const rows = quotes.map(quote => `
            <tr>
                <td>${quote.quoteID}</td>
                <td>${quote.quoteText}</td>
                <td>${quote.author ? quote.author.authorName : ''}</td>
            </tr>
        `);

        tableBody.innerHTML = rows.join('');
    }

    // Function to handle fetch errors
    function handleFetchError(error) {
        console.error('Error fetching quotes:', error);
    }

    // Event listener for the quote form submission
    quoteForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const quoteInput = document.getElementById('quoteInput').value.trim();
        const authorIdInput = document.getElementById('authorIdInput').value.trim();
        const authorNameInput = document.getElementById('authorNameInput').value.trim();

        if (quoteInput !== '' && authorIdInput !== '' && authorNameInput !== '') {
            const newQuote = {
                quoteText: quoteInput,
                author: {
                    authorID: parseInt(authorIdInput),
                    authorName: authorNameInput
                }
            };

            // Logging the newQuote object
            console.log('New Quote:', newQuote);

            addNewQuote(newQuote);
        }
    });

    // Function to add a new quote
    function addNewQuote(newQuote) {
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newQuote)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to add quote.');
                }
                fetchAndPopulateQuotes(); // Refresh quotes after adding
            })
            .catch(error => {
                console.error('Error adding quote:', error);
            });
    }

    // Load initial quotes when the page loads
    fetchAndPopulateQuotes();
});
