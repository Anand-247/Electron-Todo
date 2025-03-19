const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

let tasks = [];

// Load tasks from localStorage when the app starts
window.onload = () => {
  const storedTasks = JSON.parse(localStorage.getItem('tasks'));
  if (storedTasks) {
    tasks = storedTasks;
    renderTasks();
  }
  taskInput.focus(); // Auto-focus input
};

// Add task when the "Add" button is clicked
addBtn.addEventListener('click', addTask);

// Add task when the Enter key is pressed
taskInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addTask();
  }
});

// Always keep the focus on the input field
document.addEventListener('click', () => {
  taskInput.focus();
});

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === '') return;

  tasks.push({ text: taskText, completed: false });
  saveTasks();
  renderTasks();

  taskInput.value = '';
  taskInput.focus(); // Keep focus on input
}

function renderTasks() {
  taskList.innerHTML = ''; // Clear existing list

  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.classList.add('task-item'); // Add a class to each task item for styling

    // Capitalize the first letter of each task text
    const taskText = task.text.charAt(0).toUpperCase() + task.text.slice(1);

    li.innerHTML = `
      <span class="${task.completed ? 'completed' : ''}">
        <p>${index + 1}.</p>
        <h4>${taskText}</h4>
      </span>
      <div class="task-actions">
        <button class="checkmarkBtn">
          ${task.completed
            ? '<i class="bi bi-check-circle" style="font-size: 1.1rem; color: green;"></i>'
            : '<i class="bi bi-circle" style="font-size: 1.1rem; color: gray;"></i>'}
        </button>
        <button class="deleteBtn">
          <i class="bi bi-trash" style="font-size: 1.1rem; color: red;"></i>
        </button>
      </div>
    `;

    const checkmarkBtn = li.querySelector('.checkmarkBtn');
    const deleteBtn = li.querySelector('.deleteBtn');

    checkmarkBtn.onclick = () => toggleCompletion(index);
    deleteBtn.onclick = () => deleteTask(index);

    taskList.appendChild(li);
  });
}

function toggleCompletion(index) {
  tasks[index].completed = !tasks[index].completed; // Toggle completion status
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1); // Remove task by index
  saveTasks();
  renderTasks();
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
