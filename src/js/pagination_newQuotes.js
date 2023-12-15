window.onload = function () {
    const API_ENDPOINT = 'http://localhost:8080/api/quote/newestQuotes';
    const PAGE_SIZE = 10;
    let sortColumn = 'quoteText';
    let sortDirection = 'asc';
    let currentPage = 0;

    const tblRows = document.getElementById('quote-table-body');
    const paginationElement = document.getElementById('pagination');

    async function fetchData(page = 0) {
        const data = await fetch(`${API_ENDPOINT}?page=${page}&size=${PAGE_SIZE}&sort=${sortColumn},${sortDirection}`)
            .then(response => response.json())
            .catch(error => console.error('Error fetching data:', error));

        displayData(data.content);
        displayPagination(data.totalPages, page);
    }

    function displayData(quotes) {
        tblRows.innerHTML = quotes.map(quote => `<tr><td>${quote.quoteID}</td><td>${quote.quoteText}</td><td>${quote.author ? quote.author.authorName : ''}</td></tr>`).join('');
    }

    function displayPagination(totalPages, currentPage) {
        let paginationHtml = '';
        if (currentPage > 0) {
            paginationHtml += `<li class="page-item"><a class="page-link" data-page="${currentPage - 1}" href="#">Previous</a></li>`;
        }
        let startPage = Math.max(0, currentPage - 2);
        let endPage = Math.min(totalPages - 1, currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            if (i === currentPage) {
                paginationHtml += `<li class="page-item active"><a class="page-link" href="#">${i + 1}</a></li>`;
            } else {
                paginationHtml += `<li class="page-item"><a class="page-link" data-page="${i}" href="#">${i + 1}</a></li>`;
            }
        }

        if (currentPage < totalPages - 1) {
            paginationHtml += `<li class="page-item"><a class="page-link" data-page="${currentPage + 1}" href="#">Next</a></li>`;
        }
        paginationElement.innerHTML = paginationHtml;
    }

    document.getElementById('header-row').onclick = function (evt) {
        const id = evt.target.id;
        if (id.startsWith('sort-')) {
            sortColumn = id.substring(5);
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
            fetchData(currentPage);
        }
    };

    document.querySelector('#pagination').onclick = function (evt) {
        evt.preventDefault();
        if (evt.target.tagName === 'A' && evt.target.hasAttribute('data-page')) {
            const page = parseInt(evt.target.getAttribute('data-page'));
            currentPage = page;
            fetchData(page);
        }
    };

    fetchData(); // Initial call to the backend
};
