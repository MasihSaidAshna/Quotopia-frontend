window.onload = function () {
    const API_ENDPOINT_AUTHOR = 'http://localhost:8080/api/author';
    const PAGE_SIZE = 10;
    let sortColumn = 'authorName'; // Default sort column for Author
    let sortDirection = 'asc';
    let currentPage = 0;

    const tblRows = document.getElementById('tbl-rows-author');
    const paginationElement = document.getElementById('pagination-author');

    document.getElementById('header-row-author').onclick = function (evt) {
        const id = evt.target.id;
        if (id.startsWith('sort-')) {
            // Update sort column and direction
            sortColumn = id.substring(5);
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
            fetchData(currentPage);
        }
    };

    document.querySelector('#pagination-author').onclick = function (evt) {
        evt.preventDefault();
        if (evt.target.tagName === 'A' && evt.target.hasAttribute('data-page')) {
            const page = parseInt(evt.target.getAttribute('data-page'));
            currentPage = page;
            fetchData(page);
        }
    };

    async function fetchData(page = 0) {
        const data = await fetch(`${API_ENDPOINT_AUTHOR}?page=${page}&size=${PAGE_SIZE}&sort=${sortColumn},${sortDirection}`)
            .then(response => response.json())
        displayData(data.content);
        displayPagination(data.totalPages, page);
    }

    function displayData(authors) {
        tblRows.innerHTML = authors.map(author => `<tr><td>${author.authorName}</td></tr>`).join('');
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

    fetchData(); // Initial call to the backend
};