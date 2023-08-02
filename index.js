
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
// Function to toggle schedule visibility when the "View schedule Button" is clicked
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


//Form for users to make garbage collection requests
const garbageRequestForm = document.querySelector("#garbageRequestForm");

// Function to check if the given day is Friday(I only do special requests on fridays)
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
garbageRequestForm.addEventListener("submit", function(event){
    event.preventDefault();

    const area = document.getElementById("area").value
    const day = document.getElementById("day").value
    const timeSlot = document.getElementById("timeSlot").value

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
})
