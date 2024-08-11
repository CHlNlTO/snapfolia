document.addEventListener('DOMContentLoaded', function() {
    const locationFilter = document.getElementById('location-filter');
    const leavesContainer = document.getElementById('leaves-container');
    const leafDivs = leavesContainer.querySelectorAll('> div');

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
                div.style.display = '';
                console.log("Showing:", leafName);
            } else {
                div.style.display = 'none';
                console.log("Hiding:", leafName);
            }
        });
    }

    locationFilter.addEventListener('change', filterLeaves);

    // Initial filter
    filterLeaves();
});