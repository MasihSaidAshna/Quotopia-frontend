const URLQuote  = "http://localhost:8080/api/quote";




document.getElementById('fetchButton').addEventListener('click', () => {
    fetch(URLQuote)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.json();
        })
        .then(data => {
            makeQuoteRows(data);
            console.log(data); // Do something with the list of QuoteDTO objects
        })
        .catch(error => {
            // Handle errors
            console.error('There was a problem with the fetch operation:', error);
        });
});


function makeQuoteRows(quotes) {
    const rows = quotes.map(quote => {
        return `
      <tr>
        <td>${quote.quoteID}</td> <!-- Replace with appropriate property -->
        <td>${quote.authorId}</td> <!-- Replace with appropriate property -->
        <td>${quote.qouteText}</td>
         <td>${quote.genreID}</td>
        <td>${quote.href}</td>
        <td><a data-id-delete=${quote.id} href="#">Delete</a></td>
        <td><a data-id-edit=${quote.id} href="#">Edit</a></td>
      </tr>
    `;
    });

    document.getElementById("quote-table-body").innerHTML = rows.join("");
}


