window.onload = function() {
    const URLQuote = "http://localhost:8080/api/quote";
    const URLGenre = "http://localhost:8080/api/genre";

    // Function to fetch quotes and populate the table
    function fetchAndPopulateQuotes() {
        fetch(URLQuote)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                return response.json();
            })
            .then(data => {
                makeQuoteRows(data);
            })
            .catch(error => {
                // Handle errors
                console.error('There was a problem with fetching quotes:', error);
            });
    }

    // Function to fetch genres and populate the table
    function fetchAndPopulateGenres() {
        fetch(URLGenre)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                return response.json();
            })
            .then(data => {
                makeGenreRows(data);
            })
            .catch(error => {
                // Handle errors
                console.error('There was a problem with fetching genres:', error);
            });
    }

    // Function to create table rows for quotes
    function makeQuoteRows(quotes) {
        const tableBody = document.getElementById("quote-table-body");
        tableBody.innerHTML = ''; // Clear previous rows

        const rows = quotes.map(quote => {
            return `
                <tr>
                    <td>${quote.quoteID}</td>
                    <td>${quote.quoteText}</td>
                    <td>${quote.author ? quote.author.authorName : ''}</td> 
                </tr>
            `;
        });

        tableBody.innerHTML = rows.join("");
    }

    // Function to create table rows for genres
    function makeGenreRows(genres) {
        const tableBody = document.getElementById("genre-table-body");
        tableBody.innerHTML = ''; // Clear previous rows

        const rows = genres.map(genre => {
            return `
                <tr>
                    <td>${genre.genreID}</td>
                    <td>${genre.genreName}</td>
                </tr>
            `;
        });

        tableBody.innerHTML = rows.join("");
    }

    // Trigger the fetch and population of both quotes and genres when the page loads
    fetchAndPopulateQuotes();
    fetchAndPopulateGenres();
};



