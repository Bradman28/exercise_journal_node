// Application by Brad Surinak
// Programming Web Applications Spring 2024
// Exercise Journal

// the chooseDate function is from bootstrap and displays the date chosen from the embedded calendar icon
function chooseDate () {
    document.getElementById('date').click();
}

function generate_heatmap (all_entries) {
    const heatmap_data = {};

    all_entries.forEach(entry => {
        const entry_date = new Date(entry.date);

        const year = entry_date.getFullYear();
        const month = entry_date.getMonth() + 1;

        const key = `${year}-${month}`;

        if (heatmap_data[key]) {
            heatmap_data[key]++;
        } else {
            heatmap_data[key] = 1;
        }
    });

    return heatmap_data;
}
