let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("task-list");
const progress = document.getElementById("progress");
const numbers = document.getElementById("numbers");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

// Initialize Theme
let isDark = localStorage.getItem("theme") === "dark";
document.body.classList.toggle("dark-mode", isDark);
themeIcon.classList.replace("fa-moon", isDark ? "fa-sun" : "fa-moon");

// Theme Toggle
themeToggle.addEventListener("click", () => {
  isDark = !isDark;
  document.body.classList.toggle("dark-mode", isDark);

  // Icon update
  if (isDark) {
    themeIcon.classList.replace("fa-moon", "fa-sun");
  } else {
    themeIcon.classList.replace("fa-sun", "fa-moon");
  }

  // Save theme preference
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Add Task
document.getElementById("taskForm").addEventListener("submit", (e) => {
  e.preventDefault();
  addTask();
});

function addTask() {
  const text = taskInput.value.trim();
  if (text) {
    tasks.push({ text, completed: false });
    taskInput.value = "";
    saveTasks();
    updateTaskList();
  }
}

function deleteTask(index) {
  const li = taskList.children[index];
  li.classList.add("remove-animation");
  setTimeout(() => {
    tasks.splice(index, 1);
    saveTasks();
    updateTaskList();
  }, 300);
}

function toggleTaskComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  updateTaskList();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTaskList() {
  taskList.innerHTML = "";
  let completed = 0;

  tasks.forEach((task, index) => {
    if (task.completed) completed++;

    const li = document.createElement("li");
    li.classList.add("task-item");

    li.innerHTML = `
      <div class="task ${task.completed ? "completed" : ""}">
        <input type="checkbox" ${task.completed ? "checked" : ""} />
        <p>${task.text}</p>
      </div>
      <div class="icons">
        <img src="img/edit.png" onclick="editTask(${index})" alt="edit" />
        <img src="img/bin.png" onclick="deleteTask(${index})" alt="delete" />
      </div>
    `;

    // Add checkbox listener
    li.querySelector("input").addEventListener("change", () => toggleTaskComplete(index));
    li.classList.add("fade-in");
    taskList.appendChild(li);
  });

  // Update progress bar and numbers
  const percent = tasks.length ? (completed / tasks.length) * 100 : 0;
  progress.style.width = `${percent}%`;
  numbers.textContent = `${completed} / ${tasks.length}`;

  if (tasks.length && completed === tasks.length) {
    launchConfetti();
  }
}

function editTask(index) {
  const newText = prompt("Edit your task:", tasks[index].text);
  if (newText !== null) {
    tasks[index].text = newText.trim();
    saveTasks();
    updateTaskList();
  }
}

function launchConfetti() {
  const container = document.getElementById("celebration");
  for (let i = 0; i < 150; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.top = `-${Math.random() * 20}px`;
    confetti.style.setProperty("--hue", Math.floor(Math.random() * 360));
    container.appendChild(confetti);
    setTimeout(() => container.removeChild(confetti), 3000);
  }
}

// Initial Render
updateTaskList();
