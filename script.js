// accessing all dom elements
let addToDoinput = document.querySelector(".addToDoinput");
let duedate = document.querySelector(".duedate");
let addorupdate = document.querySelector(".addorupdate");
let clearbtn = document.querySelector(".clearbtn");
let statusbtns = document.querySelector(".statusdiv");
let alertBox = document.querySelector("#alert");
let tbody = document.querySelector("#tbody");

let toDo = JSON.parse(localStorage.getItem("todos"))||[];

let editID = null;


function saveToDo(){
   localStorage.setItem("todos", JSON.stringify(toDo));
}


function formatText(text){
    return text.length > 16 ? text.slice(0, 15) + '...' : text;
}

function formatDate(date){
    return date ? date : 'no-due-date';
}

function status(isCompleted) {
  return isCompleted
    ? { text: "Completed", class: "status-completed" }
    : { text: "Pending", class: "status-pending" };
}


function renderToDos(list){
    tbody.innerHTML = '';
    console.log("tbody list", list);
    if (list.length === 0){
        tbody.innerHTML = `<tr><td colspan="4">No data</td></tr>`;
    }


    // if data exists
list.forEach (ele => {
    const taskStatus = status(ele.completed);
    let tr = document.createElement("tr");
    tr.innerHTML = `<td scope = "col">${formatText(ele.taskValue)}</td>
                    <td scope = "col">${formatDate(ele.DueDate)}</td>
                    <td scope = "col" class="${taskStatus.completed}">${taskStatus.text}</td>
                    <td scope = "col">
                    <button class="button" onclick="editToDos('${ele.id}')">Edit</button>
                    <button class="button" onclick="toggleStatus('${ele.id}')">${ele.completed? 'Mark Pending' : 'Mark Done'}</button>
                    <button class="button" onclick="deleteToDos('${ele.id}')">Delete🚮</button>
                    </td>`;
    tbody.appendChild(tr);
});
}

// function to add or update To-Dos
function addOrUpdateToDo(){
// taking the user input (ToDo and DueDate)
let taskValue = addToDoinput.value.trim();
console.log(taskValue);

let DueDate = duedate.value;
console.log(DueDate);

// making sure that task exists
if (!taskValue){
    AlertBox("❌Please enter a task.", "danger");
    return;
}

// condition for adding or updating ToDos
if (editID){
    console.log("editing...id", editID);
     toDo = toDo.map((t) =>
  t.id === editID ? { ...t, taskValue, DueDate } : t
);

    AlertBox("Updated ToDo", "success");
    editID = null;
    addorupdate.innerText = "Add ToDo";
}else {
toDo.push({id: generateId(), taskValue, DueDate, completed:false});
AlertBox("✅Added ToDo.", "success");
}


// to save to local Storage
saveToDo();
renderToDos(toDo);

// clear the input field
addToDoinput.value = "";
duedate.value = "";
}

// function to delete To-Dos
function deleteToDos(id){
console.log("deletedId", id);
// prints the remaining ToDos except the delete toDo in ui
toDo = toDo.filter((t) => t.id !== id);
// saving the todo to local storage after deletion
saveToDo();
// updating the ui after deletion
renderToDos(toDo);
AlertBox("Deleted To-Dos", "danger");
}

// function to delete all To-Dos
function deleteAllToDos(){
toDo = [];
saveToDo();
renderToDos(toDo);
AlertBox("Deleted All To-Dos", "danger");
}

// function to edit To-Dos
function editToDos(id){
console.log("edited:", id);
// clicked id is equal to that existing in the todo array then return the element
let todos = toDo.find(t => t.id === id);
console.log("editingtodo", todos);
if(!todos)return;
// passing the values (todo and date) that we get from particular edit to input to edit it
addToDoinput.value = todos.taskValue;
duedate.value = todos.DueDate || "";
editID = id;
addorupdate.innerText = "UpdateToDo";
}

// function to toggle status
function toggleStatus(toggleId){
     toDo = toDo.map((t) => t.id === toggleId ? {...t, completed:!t.completed}:t);
     saveToDo();
     renderToDos(toDo);
}

// filter to-dos
function filterToDos(filterType) {
  let filtered = [];

  if (filterType === "all") {
    filtered = toDo;
  } else if (filterType === "completed") {
    filtered = toDo.filter(t => t.completed === true);
  } else if (filterType === "pending") {
    filtered = toDo.filter(t => t.completed === false);
  }

  renderToDos(filtered);
}


// function to generate ids
function generateId(){
return "_" + Math.random().toString(36).substring(2,9);
}


function AlertBox(message, type = "info") {
  // Remove old styles
  alertBox.className = "alert-box";

  // Add the new type (info / success / danger)
  alertBox.classList.add(`alert-${type}`);
  alertBox.classList.add("show");

  // Set the text message
  alertBox.textContent = message;

  // Hide after 3 seconds
  setTimeout(() => {
    alertBox.classList.remove("show");
  }, 3000);
}


renderToDos(toDo);
