document.addEventListener("DOMContentLoaded", function() {

let dataUrl ="http://localhost:3000/Schedule"
const sideBar = document.querySelector("#sidebar");
let isScheduleVisible = false; 
const scheduleContainer = document.createElement("div")


// Function to display garbage collection schedule on the web page
function showSchedule(){
fetch(dataUrl)
.then(res => res.json())
.then(data => displaySchedule(data))
.catch(error => console.log(error))
}

//Function to display schedule 
function displaySchedule (data) {
 // Clear previous schedule items
 scheduleContainer.innerHTML = '';

    data.forEach(item =>{
    const listItem = document.createElement("li")

    listItem.innerHTML = `
    <h5>${item.day}</h5>
    <h6>Area: ${item.area}</h6>
    <p>Morning: ${item.morning}</p>
    <p>MidMorning: ${item.midMorning}</p>
    <p>Afternoon: ${item.afterNoon}</p>`;
    scheduleContainer.appendChild(listItem)
 })
 
}
// Function to toggle schedule visibility 
//when the "View schedule Button" is clicked
function viewScheduleOnClick() {
    if(isScheduleVisible){
        scheduleContainer.innerHTML = ''; // Clear the schedule if it is visible
        isScheduleVisible =false;
    }else{
    showSchedule();
    isScheduleVisible = true;
    }
}
// Add event listeners to the viewscheduleButton
let viewScheduleButton = document.createElement("button")
viewScheduleButton.textContent = "View Schedule"
viewScheduleButton.addEventListener("click", viewScheduleOnClick)
sideBar.appendChild(viewScheduleButton)
sideBar.appendChild(scheduleContainer)


const showResourcesButton = document.getElementById("showResources");
const resourcesContent = document.getElementById("resourcesContent");

showResourcesButton.addEventListener("click", () => {
    if (resourcesContent.style.display === "none") {
        resourcesContent.style.display = "block";
    } else {
        resourcesContent.style.display = "none";
    }
});

//Add eventlistener to the like button
//I have added a like button for interactivity
const likeButtons = document.querySelectorAll(".like-button");
likeButtons.forEach(likeButton => {
    let likeCount = 0;
    const likeCountElement = likeButton.nextElementSibling;
    
    likeButton.addEventListener("click", () => {
        likeCount++;
        likeCountElement.textContent = `${likeCount} Like${likeCount === 1 ? '' : 's'}`;
    });
});


//Form for users to make garbage collection requests
const garbageRequestForm = document.querySelector("#garbageRequestForm");

// Function to check if the given day is Friday
//(I only do special requests on fridays)
function isFriday(day) {
    return day.toLowerCase() === "friday";
}

// Function to check if the given time slot is free on Friday
function isTimeSlotFree (schedule, timeSlot) {
    const fridaySchedule = schedule.find(item => isFriday(item.day));
    return fridaySchedule[timeSlot] === "free";
}

// Function to update the schedule
function updateSchedule (day,timeSlot, area) {
    fetch(dataUrl)
    .then(res =>res.json())
    .then(data =>{
        const fridaySchedule = data.find(item =>isFriday(item.day));
        fridaySchedule[timeSlot] =area;
        console.log(timeSlot)

         // Update the schedule on the server
         fetch(`${dataUrl}/5`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(fridaySchedule)
         })
         .then(()=>{
            alert("Your garbage collection has been submitted for Friday")
         })
         .catch(error => console.log(error));
    })
}
// add event listeners to the form
garbageRequestForm.addEventListener("submit", function(event){
    event.preventDefault();

    const area = document.getElementById("area").value
    const day = document.getElementById("day").value
    const timeSlot = document.getElementById("timeSlot").value

    // Alert if the day entered is not friday
    if (!isFriday(day)) {
        alert("Sorry, we only offer garbage collection on Fridays.");
        return;
    }

    fetch(dataUrl)
    .then(res => res.json())
        .then(data => {
            if (!isTimeSlotFree(data, timeSlot)) {
                alert(`Sorry, the ${timeSlot} time slot on Friday is already booked.`);
            } else {
                updateSchedule(day, timeSlot, area);
            }
        })
        .catch(error => console.log(error));

         // Reset input fields after submission
    document.getElementById("area").value = "";
    document.getElementById("day").value = "";
    document.getElementById("timeSlot").value = "";
});

// Here I want to implement search and delete
// Function to search for an entry by Id
function searchEntry(id) {

    const oneEntryContainer = document.getElementById("deletediv")
    fetch(`${dataUrl}/${id}`)
    .then(res =>{
        if (!res.ok) {
            if (res.status === 404) {
                alert("Entry not found");
                oneEntryContainer.innerHTML = "";
                const searchIdInput = document.getElementById("searchId");
                searchIdInput.value = ""; // Clear the search input field

            }
            throw new Error("Error fetching data");
        }
        return res.json();
    })
    .then(data =>{
        const entryContainer =document.createElement("div")
        entryContainer.innerHTML = `
        <h5>${data.day}</h5>
        <h6>Area: ${data.area}</h6>
        <p>Morning: ${data.morning}</p>
        <p>MidMorning: ${data.midMorning}</p>
        <p>Afternoon: ${data.afterNoon}</p>`;
        oneEntryContainer.innerHTML = ""; // Clear previous content

        // Clear input field
    const searchIdInput = document.getElementById("searchId");
    searchIdInput.value = ""; // Clear the search input field

        // Create the delete button
        const deleteButton = document.createElement("button");
        deleteButton.innerHTML= "Delete";
    
        
        //Add event listener to the delete button,
        //calling the deleteSheduleEntry function below
        deleteButton.addEventListener("click",  deleteScheduleEntry);
        entryContainer.appendChild(deleteButton);
        oneEntryContainer.appendChild(entryContainer);
    })
    .catch(error => console.log(error));


    
}

let searchButton =document.getElementById("searchButton")
searchButton.addEventListener("click", function(event){
    event.preventDefault();

    // Get the value from the search input field with id "searchId"
    const searchId = document.getElementById("searchId").value
    searchEntry(searchId);
});

//This function handles DELETE
function deleteScheduleEntry(id) {
    fetch(`${dataUrl}/${id}`, {
        method: "DELETE"

    })
    .then(() =>{
        alert("Entry deleted successfully!");
        
        //Clear the contents after deletion
        const oneEntryContainer = document.querySelector("#deletediv");
        oneEntryContainer.innerHTML = '';
    })
    .catch(error =>console.error("Error deleting entry", error));
}
});
