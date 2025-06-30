let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.querySelector('.task-list');
const progress = document.getElementById('progress');
const numbers = document.getElementById('numbers');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

// Initialize Theme
let isDark = localStorage.getItem('theme') === 'dark';
document.body.classList.toggle('dark-mode', isDark);
themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';

// ✅ Toggle Theme
themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  document.body.classList.toggle('dark-mode', isDark);
  themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// ✅ Handle Form Submission
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  addTask();
});

// ✅ Add Task
function addTask() {
  const text = taskInput.value.trim();
  if (text !== '') {
    tasks.push({ text, completed: false });
    taskInput.value = '';
    saveTasks();
    updateTaskList();
  }
}

// ✅ Delete Task
function deleteTask(index) {
  const li = taskList.children[index];
  li.classList.add('remove-animation');
  setTimeout(() => {
    tasks.splice(index, 1);
    saveTasks();
    updateTaskList();
  }, 300);
}

// ✅ Toggle Completion
function toggleTaskComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  updateTaskList();
}

// ✅ Save to LocalStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ✅ Render Tasks
function updateTaskList() {
  taskList.innerHTML = '';
  let completed = 0;

  tasks.forEach((task, index) => {
    if (task.completed) completed++;

    const li = document.createElement('li');
    li.classList.add('task-item', 'fade-in');
    li.innerHTML = `
      <div class="task ${task.completed ? 'completed' : ''}">
        <input type="checkbox" ${task.completed ? 'checked' : ''} />
        <p>${task.text}</p>
      </div>
      <div class="icons">
        <img src="img/edit.png" alt="Edit" onclick="editTask(${index})" />
        <img src="img/bin.png" alt="Delete" onclick="deleteTask(${index})" />
      </div>
    `;

    li.querySelector('input').addEventListener('change', () => toggleTaskComplete(index));
    taskList.appendChild(li);
  });

  // Update progress bar and count
  const percent = tasks.length ? (completed / tasks.length) * 100 : 0;
  progress.style.width = `${percent}%`;
  numbers.textContent = `${completed} / ${tasks.length}`;

  // Confetti 🎉
  if (tasks.length && completed === tasks.length) {
    launchConfetti();
  }
}

// ✅ Edit Task
function editTask(index) {
  const newText = prompt('Edit your task:', tasks[index].text);
  if (newText !== null && newText.trim() !== '') {
    tasks[index].text = newText.trim();
    saveTasks();
    updateTaskList();
  }
}

// ✅ Confetti Animation
function launchConfetti() {
  const container = document.getElementById('celebration');

  for (let i = 0; i < 150; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';

    // Random horizontal position
    confetti.style.left = `${Math.random() * 100}%`;

    // Random vertical starting position (above the screen)
    confetti.style.top = `${Math.random() * -window.innerHeight}px`;

    // Random hue for color
    confetti.style.setProperty('--hue', Math.floor(Math.random() * 360));

    // Random size
    const size = Math.random() * 8 + 4; // size between 4px and 12px
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size}px`;

    container.appendChild(confetti);

    // Remove after animation ends (3s)
    setTimeout(() => container.removeChild(confetti), 3000);
  }
}

// ✅ On Load
updateTaskList();
