window.onload = function () {
    const URLQuote = "http://localhost:8080/api/quote";

    fetchAndPopulateQuotes();

    function fetchAndPopulateQuotes() {
        fetch(URLQuote)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok. Status: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                makeQuoteRows(data);
            })
            .catch(error => {
                console.error('There was a problem with fetching quotes:', error);
            });
    }



    function makeQuoteRows(quotes) {
        const tableBody = document.getElementById("quoteTableBody");
        tableBody.innerHTML = '';

        const rows = quotes.map(quote => {
            return `
        <tr>
          <td>${quote.quoteID}</td>
          <td>${quote.quoteText}</td>
          <td>${quote.author ? quote.author.authorName : ''}</td>
          <td>${quote.genre ? quote.genre.genreName : ''}</td>
          <td>
            <button class="btn btn-sm btn-info edit-btn" data-id="${quote.quoteID}">Edit</button>
            <button class="btn btn-sm btn-danger delete-btn" data-id="${quote.quoteID}">Delete</button>
          </td>
        </tr>
      `;
        });

        tableBody.innerHTML = rows.join("");

        // Event listeners for edit and delete buttons
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('edit-btn')) {
                const quoteID = event.target.getAttribute('data-id');
                fetch(`${URLQuote}/${quoteID}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok.');
                        }
                        return response.json();
                    })
                    .then(data => {
                        // Fill the edit form fields with quote data
                        console.log(data)
                        document.getElementById("editQuoteTextInput").value = data.quoteText;
                        document.getElementById("editAuthorNameInput").value = data.author ? data.author.authorName : '';
                        document.getElementById("editAuthorNameInput").setAttribute("data-author-id", data.author ? data.author.authorID : '')
                        document.getElementById("editGenreNameInput").value = data.genre ? data.genre.genreName : '';
                        document.getElementById("editGenreNameInput").setAttribute("data-genre-id", data.genre ? data.genre.genreID : '')

                        // Show the edit modal
                        $('#editModal').modal('show');

                        // Handle form submission for updating quote
                        const editQuoteForm = document.getElementById("editQuoteForm");
                        editQuoteForm.addEventListener("submit", (submitEvent) => {
                            submitEvent.preventDefault();
                            const editedQuote = {
                                quoteText: document.getElementById("editQuoteTextInput").value,
                                author: {
                                    authorID: document.getElementById("editAuthorNameInput").getAttribute("data-author-id"),
                                    authorName: document.getElementById("editAuthorNameInput").value,
                                },

                                genre: {
                                    genreID: document.getElementById("editGenreNameInput").getAttribute("data-genre-id"),
                                    genreName: document.getElementById("editGenreNameInput").value,
                                },

                            };
                            fetchAndUpdateQuote(quoteID, editedQuote);
                        });
                    })
                    .catch(error => {
                        console.error('There was a problem with fetching quote details:', error);
                    });
            }

            if (event.target.classList.contains('delete-btn')) {
                const quoteID = event.target.getAttribute('data-id');
                if (confirm("Are you sure you want to delete this quote?")) {
                    fetch(`${URLQuote}/${quoteID}`, {
                        method: "DELETE"
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Failed to delete quote.');
                            }
                            fetchAndPopulateQuotes();
                        })
                        .catch(error => {
                            console.error("Error deleting quote:", error);
                        });
                }
            }
        });
    }

    // Function for adding new quotes
    const quoteForm = document.getElementById("quoteForm");
    quoteForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const newQuote = {
            quoteText: document.getElementById("quoteTextInput").value,
            author: {
                authorName: document.getElementById("authorNameInput").value,
            },
            genre: {
                genreName: document.getElementById("genreNameInput").value,
            },
        };
        createNewQuote(newQuote);
    });

    function createNewQuote(newQuote) {
        const { quoteText, author, genre } = newQuote;

        // Check if required fields are empty
        if (!quoteText || !author.authorName || !genre.genreName) {
            console.error("Please fill in all required fields.");
            return;
        }

        fetch(URLQuote, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newQuote),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to add new quote.");
                }
                // Clear the form after successful addition
                document.getElementById("quoteForm").reset();
                fetchAndPopulateQuotes(); // Refresh quotes after addition
            })
            .catch((error) => {
                console.error("Error adding new quote:", error);
            });
    }

    // Function for updating a quote
    function fetchAndUpdateQuote(quoteID, editedQuote) {
        console.log(editedQuote)
        fetch(`${URLQuote}/${quoteID}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(editedQuote),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to update quote.");
                }
                $('#editModal').modal('hide');
                fetchAndPopulateQuotes();
            })
            .catch((error) => {
                console.error("Error updating quote:", error);
            });
    }

    // Other functions related to quote management
    // ....
};
