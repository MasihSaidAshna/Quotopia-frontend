window.onload = function() {
    const URLQuote = "http://localhost:8080/api/quote";

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
                console.error('There was a problem with the fetch operation:', error);
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

    // Trigger the fetch and population of quotes when the page loads
    fetchAndPopulateQuotes();
};


