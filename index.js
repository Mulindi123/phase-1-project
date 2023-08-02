
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
