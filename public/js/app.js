// Application by Brad Surinak
// Programming Web Applications Spring 2024
// Exercise Journal

/* 
The Exercise Journal app is a way for users to log their daily exercise activity. The app works by allowing the user to input their exercise
details at the various prompts, these inputs will then be stored in local storage list of exerciseDataList, then displayed in the journal page upon page load. The user has the option to continue to build on this log or can modify by either removing a single entry, archiving a single entry, or archiving all entries. Archived entries will be saved to a new list in local storage archivedEntryList. The Archive page allows the user to delete a single entry, or delete all entries in both Journal and Archive.
*/

// the pullData function takes user input data on new_entry.html and saves to local storage 
// this function is called when the user clicks the Post button
// function pullData () {
//     let date = document.getElementById("date").value;
//     let exercise = document.getElementById("exercise").value;
//     let weight = document.getElementById("weight").value;
//     let sets = document.getElementById("sets").value;
//     let reps = document.getElementById("reps").value;
//
//     const exerciseData = {
//         date: date,
//         exercise: exercise,
//         weight: weight,
//         sets: sets,
//         reps: reps
//     };
//
//     //get existing entries, convert to object, push to exerciseData variable, set to local storage as string
//     fetch('/new_entry', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(exerciseData)
//     })
//         .then(response => {
//             if(response.ok) {}
//         })
// }

// the chooseDate function is from bootstrap and displays the date choosen from the embedded calendar icon
function chooseDate () {
    document.getElementById('date').click();
}

//the postData function pulls the data from local storage and adds it to the table on journal.html
// a button to call removeEx is included in the table
function postData () {
    
    //variable created where new rows will be appended
    let tableBody = document.querySelector("#saved_ex tbody");
    tableBody.innerHTML = '';

    //retrieve data from local storage, empty brackets ensure that blank fields are included 
    let exerciseDataList = JSON.parse(localStorage.getItem("exerciseDataList")) || [];
    
    //loop to iterate over each element in exerciseDataList 
    // exerciseData, element in array.. index, index of current element processed
    exerciseDataList.forEach(function(exerciseData, index) {

        // new <tr> is created for each exercise element, innerHTML of row set to include <td>
        let row = document.createElement("tr");

        row.innerHTML = `
        <td>${exerciseData.date}</td>
        <td>${exerciseData.exercise}</td>
        <td>${exerciseData.weight}</td>
        <td>${exerciseData.sets}</td>
        <td>${exerciseData.reps}</td>
        <td><button class="btn btn-info btn-sm" onclick="archiveData(${index})">Archive</button></td>
        <td><button class="btn btn-danger btn-sm" onclick="removeEx(${index})">Remove</button></td>
        `;
        
        //new row is appended to tableBody, which represents tbody element and adds row to table
        tableBody.appendChild(row);
    });
}

// the archiveData function is called when the archive button is clicked on a row (similar to pullData)
// the data on that row is removed from the table and added to archivedEntry
function archiveData(index) {
    let tableBody = document.querySelector("#saved_ex tbody");
    let row = tableBody.children[index];
    let confirmation = confirm("Are you sure you want to archive this entry?");

    if (confirmation) {
        let arc_date = row.cells[0].innerText;
        let arc_exercise = row.cells[1].innerText;
        let arc_weight = row.cells[2].innerText;
        let arc_sets = row.cells[3].innerText;
        let arc_reps = row.cells[4].innerText;
        
        let archivedEntry = {
            date: arc_date,
            exercise: arc_exercise,
            weight: arc_weight,
            sets: arc_sets,
            reps: arc_reps
        };
    
        let archivedEntryList = JSON.parse(localStorage.getItem("archivedEntryList")) || [];
        archivedEntryList.push(archivedEntry);
        localStorage.setItem("archivedEntryList", JSON.stringify(archivedEntryList));
    
        // removes from exerciseDataList
        let exerciseDataList = JSON.parse(localStorage.getItem("exerciseDataList")) || [];
        exerciseDataList.splice(index, 1);
        localStorage.setItem("exerciseDataList", JSON.stringify(exerciseDataList));
    
        postData();
    
    };
}

// the removeEx function allows the user to delete a single entry on their journal page, without deleting all
//postData function is called at the end to update the table
function removeEx(index) {
    let exerciseDataList = JSON.parse(localStorage.getItem("exerciseDataList")) || [];

    let confirmation = confirm("Are you sure you want to clear this row?")
    if (confirmation) {
        // Remove the entry corresponding to the given index from the array
        exerciseDataList.splice(index, 1);

        // Update local storage with the modified array
        localStorage.setItem("exerciseDataList", JSON.stringify(exerciseDataList));

        // Run postData function to update the table 
        postData();
    }
}

// the archiveAll function will take all journal entries from exerciseDataList list in local storage and move them to
// the archivedEntryList list
function archiveAll() {
    let exerciseDataList = JSON.parse(localStorage.getItem("exerciseDataList")) || [];
    let archivedEntryList = JSON.parse(localStorage.getItem("archivedEntryList")) || [];
    let confirmation = confirm("Are you sure you want to archive all entries in your Journal?")

    if (confirmation) {
        // push entire exerciseDataList list to archivedEntryList list
        archivedEntryList.push(...exerciseDataList);

        localStorage.setItem("archivedEntryList", JSON.stringify(archivedEntryList));
    
        // Clear the journal page's local storage
        localStorage.removeItem("exerciseDataList");
    
        // Reload the page to reflect changes
        window.location.href = "archive.html";
    }
}

// the postArchive function displays all all data in the archivedEntryList list on the table in archive.html
function postArchive() {
    let tableBody = document.querySelector("#archived_ex tbody");
    tableBody.innerHTML = '';

    //retrieve data from local storage
    let archivedEntryList = JSON.parse(localStorage.getItem("archivedEntryList")) || [];
    
    //loop to iterate over each element in exerciseDataList
    archivedEntryList.forEach(function(archivedData, index) {

        // new <tr> is created for each exercise element, innerHTML of row set to include <td>
        let row = document.createElement("tr");

        row.innerHTML = `
        <td>${archivedData.date}</td>
        <td>${archivedData.exercise}</td>
        <td>${archivedData.weight}</td>
        <td>${archivedData.sets}</td>
        <td>${archivedData.reps}</td>
        <td><button class="btn btn-danger btn-sm" onclick="removeArc(${index})">Remove</button></td>
        `;
        
        //new row is appended to tableBody, which represents tbody element of table
        tableBody.appendChild(row);
    });
}

// the removeArc function removes a single line entry from the archive page
function removeArc(index) {
    let archivedEntryList = JSON.parse(localStorage.getItem("archivedEntryList")) || [];

    let confirmation = confirm("Are you sure you want to clear this row?")
    if (confirmation) {
        // Remove the entry corresponding to the given index from the array
        archivedEntryList.splice(index, 1);

        // Update local storage with the modified array
        localStorage.setItem("archivedEntryList", JSON.stringify(archivedEntryList));

        // Run postData function to update the table 
        postArchive();
    }
}

// the clearData function clears all journal entries and is called by using the Clear All button in the archive.html 
function clearData(){
    let confirmation = confirm("Are you sure you want to clear all data?")
    if (confirmation) {
        let confirmTwo = confirm("This will clear all Journal and Archive entries, are you sure?")
        if (confirmTwo)
            localStorage.clear();
            window.location.href = "archive.html";
    }
}
