document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const leavesContainer = document.getElementById('leaves-container');

    // Select all the leaf divs containing the buttons
    const leafDivs = leavesContainer.querySelectorAll('.flex.flex-column.justify-content-center.align-items-center.pb-2.min-w-412');

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        console.log(`Search term: "${searchTerm}"`);

        let matchFound = false;

        leafDivs.forEach(div => {
            if (div.style.display === 'none') {
                return; // Skip hidden elements
            }

            const button = div.querySelector('button');
            if (!button) return;

            console.log(`Button text: ${div.querySelector('h1').textContent}`);

            const leafName = button.querySelector('h1').textContent.toLowerCase().trim();
            const leafEnglishName = button.querySelector('h3').textContent.toLowerCase().trim();

            // Show only the divs that match the search term
            if (searchTerm === '' || leafName.includes(searchTerm) || leafEnglishName.includes(searchTerm)) {
                div.style.display = 'flex'; // Show the matching div
                matchFound = true;
            } else {
                div.style.display = 'none'; // Hide the non-matching div
            }
        });

        // Update the container's display style based on matches
        if (matchFound) {
            leavesContainer.style.display = 'flex';
        } else {
            leavesContainer.style.display = 'none';
        }

        if (!matchFound && searchTerm !== '') {
            console.log("No matching leaves found");
            // Optionally, display a "No results found" message to the user
            const noResultsMsg = document.getElementById('no-results-message');
            if (noResultsMsg) {
                noResultsMsg.style.display = 'block';
            } else {
                const newMsg = document.createElement('p');
                newMsg.id = 'no-results-message';
                newMsg.textContent = 'No matching leaves found';
                newMsg.style.display = 'block';
                leavesContainer.parentNode.insertBefore(newMsg, leavesContainer.nextSibling);
            }
        } else {
            const noResultsMsg = document.getElementById('no-results-message');
            if (noResultsMsg) {
                noResultsMsg.style.display = 'none';
            }
        }
    }

    // Perform search on every input event in the search input
    searchInput.addEventListener('input', performSearch);

    // Keep the button click event for compatibility
    searchButton.addEventListener('click', performSearch);

    console.log('Search functionality initialized');
});