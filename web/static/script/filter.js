document.addEventListener('DOMContentLoaded', function() {
    const locationFilter = document.getElementById('location-filter');
    const leavesContainer = document.getElementById('leaves-container');
    const leafDivs = leavesContainer.querySelectorAll('.flex.flex-column.justify-content-center.align-items-center.pb-2.min-w-412');

    const locations = {
        'faith-colleges': ['apitong', 'balayong', 'betis', 'duhat', 'ilang-ilang', 'ipil', 'kalios', 'kamagong', 'mahogany', 'mulawin', 'narra', 'palo-maria', 'scramble-egg', 'sintores', 'yakal'],
        'batangas-lakelands': ['alibangbang', 'amugis', 'banaba', 'bani', 'barako', 'binunga', 'eucalyptus', 'hinadyong', 'lansones', 'madre-cacao', 'native-talisay', 'tibig'],
        'marian-orchard': ['asis', 'dao', 'langka', 'balete', 'bayabas', 'dita', 'guyabano']
    };

    function getLeafName(div) {
        const h1 = div.querySelector('button h1');
        return h1 ? h1.textContent.toLowerCase().replace(/\s+/g, '-') : '';
    }

    function filterLeaves() {
        const selectedLocation = locationFilter.value;
        console.log("Selected location:", selectedLocation);

        leafDivs.forEach(div => {
            const leafName = getLeafName(div);
            console.log("Leaf name:", leafName);

            if (selectedLocation === 'all' || locations[selectedLocation].includes(leafName)) {
                div.style.display = 'flex'; // Show the matching div
                div.classList.add('visible'); // Add a class to indicate it's visible
                console.log("Showing:", leafName);
            } else {
                div.style.display = 'none'; // Hide the non-matching div
                div.classList.remove('visible'); // Remove the class if not visible
                console.log("Hiding:", leafName);
            }
        });

        // Initial search with the updated visible elements
        performSearch();
    }


    locationFilter.addEventListener('change', filterLeaves);

    // Initial filter
    filterLeaves();
});