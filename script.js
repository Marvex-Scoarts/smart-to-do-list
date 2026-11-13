// Grab elements from the HTML
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const filterButtons = document.querySelectorAll('.filters button');

// Load saved tasks from Local Storage (or start with an empty list)
let tasks = JSON.parse(localStorage.getItem('smartTodoTasks')) || [];
let currentFilter = 'all';

// Highlight the "All" filter button on startup
document.querySelector('[data-filter="all"]').classList.add('active');

// Save tasks to Local Storage
function saveTasks() {
  localStorage.setItem('smartTodoTasks', JSON.stringify(tasks));
}

// Render tasks on the screen based on the active filter
function renderTasks() {
  todoList.innerHTML = '';

  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  });

  filteredTasks.forEach(task => {
    const li = document.createElement('li');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTask(task.id));

    const span = document.createElement('span');
    span.textContent = task.text;

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
  });
}

// Add a new task
todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (!text) return;

  const newTask = {
    id: Date.now(),
    text: text,
    completed: false
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  todoInput.value = '';
});

// Toggle completed status
function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

// Delete a task
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

// Handle filter button clicks
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    currentFilter = button.dataset.filter;
    renderTasks();
  });
});

// Draw the initial list when the page loads
renderTasks();