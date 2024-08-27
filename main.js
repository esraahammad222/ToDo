// Get current location
document.getElementById("getLocation").addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      document.getElementById(
        "location"
      ).textContent = `Latitude: ${latitude}, Longitude: ${longitude}`;
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
});

// Variables to hold references to the task lists
const todoList = document.getElementById("todoList");
const inProgressList = document.getElementById("inProgressList");
const doneList = document.getElementById("doneList");

// Add task function
document.getElementById("addTask").addEventListener("click", () => {
  const task = document.getElementById("taskInput").value;
  if (task) {
    addTaskToList("todoList", task);
    document.getElementById("taskInput").value = "";
    saveTasks();
  }
});

// Function to add tasks to the appropriate list
function addTaskToList(listId, taskText) {
  const list = document.getElementById(listId);
  const li = document.createElement("li");
  li.textContent = taskText;
  li.draggable = true;
  li.classList.add("draggable");

  // Remove button
  const removeBtn = document.createElement("button");
  removeBtn.textContent = "Remove";
  removeBtn.addEventListener("click", () => {
    list.removeChild(li);
    saveTasks();
  });

  li.appendChild(removeBtn);
  list.appendChild(li);

  // Drag and Drop events
  li.addEventListener("dragstart", dragStart);
}

// Drag and Drop event handlers
function dragStart(event) {
  event.dataTransfer.setData("text/html", event.target.outerHTML);
  setTimeout(() => {
    event.target.style.display = "none";
  }, 0);
}

function dragOver(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();
  const list = event.target.closest(".task-list");
  if (list) {
    const html = event.dataTransfer.getData("text/html");
    list.insertAdjacentHTML("beforeend", html);
    const newTask = list.lastElementChild;

    // Reattach dragstart and remove button listeners
    newTask.addEventListener("dragstart", dragStart);
    newTask.querySelector("button").addEventListener("click", () => {
      list.removeChild(newTask);
      saveTasks();
    });

    saveTasks();
  }
}

// Save tasks to local storage
function saveTasks() {
  const tasks = {
    todo: todoList.innerHTML,
    inProgress: inProgressList.innerHTML,
    done: doneList.innerHTML,
  };
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from local storage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  if (tasks) {
    todoList.innerHTML = tasks.todo;
    inProgressList.innerHTML = tasks.inProgress;
    doneList.innerHTML = tasks.done;
  }

  document.querySelectorAll(".draggable").forEach((li) => {
    li.addEventListener("dragstart", dragStart);
    li.querySelector("button").addEventListener("click", () => {
      li.parentElement.removeChild(li);
      saveTasks();
    });
  });
}

// Clear all tasks
document.getElementById("clearAll").addEventListener("click", () => {
  localStorage.clear();
  todoList.innerHTML = "";
  inProgressList.innerHTML = "";
  doneList.innerHTML = "";
});

document.querySelectorAll(".task-list").forEach((list) => {
  list.addEventListener("dragover", dragOver);
  list.addEventListener("drop", drop);
});

// Load tasks when the page loads
loadTasks();
