let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
let filter = 'all';
let currentEditId = null;


const taskInput = document.getElementById('new-task');
const addBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const filterBtns = document.querySelectorAll('.filter-btn');
const allCountEl = document.getElementById('all-count');
const activeCountEl = document.getElementById('active-count');
const completedCountEl = document.getElementById('completed-count');
const clearCompletedBtn = document.getElementById('clear-completed');
const categorySelect = document.getElementById('task-category');
const modal = document.getElementById('edit-modal');
const editInput = document.getElementById('edit-task-input');
const saveEditBtn = document.getElementById('save-edit');
const cancelEditBtn = document.getElementById('cancel-edit');
const closeModal = document.querySelector('.close');

const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = themeToggle.querySelector('i');


if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
}

themeToggle.onclick = () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    if (isDark) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    }
};


addBtn.onclick = () => {
    const text = taskInput.value.trim();
    const category = categorySelect.value;
    const selectedOption = categorySelect.options[categorySelect.selectedIndex];
    const color = selectedOption.getAttribute('data-color');
    const icon = selectedOption.textContent.split(' ')[0];

    if (text) {
        tasks.push({
            id: Date.now(),
            text,
            completed: false,
            category,
            color,
            icon
        });
        taskInput.value = '';
        saveAndRender();
    }
};

taskInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') addBtn.click();
});

function render() {
    taskList.innerHTML = '';
    let filteredTasks = tasks;
    if (filter === 'active') filteredTasks = tasks.filter(t => !t.completed);
    if (filter === 'completed') filteredTasks = tasks.filter(t => t.completed);

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item' + (task.completed ? ' completed' : '');
        li.setAttribute('data-id', task.id);

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;
        checkbox.onchange = () => {
            task.completed = !task.completed;
            saveAndRender();
        };

        const catSpan = document.createElement('span');
        catSpan.className = 'category-label';
        catSpan.style.background = task.color;
        catSpan.textContent = `${task.icon} ${task.category}`;

        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = task.text;

        const actions = document.createElement('div');
        actions.className = 'task-actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.onclick = () => openEditModal(task);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.onclick = () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveAndRender();
        };

        actions.append(editBtn, deleteBtn);
        li.append(checkbox, catSpan, span, actions);
        taskList.appendChild(li);
    });

    const activeCount = tasks.filter(t => !t.completed).length;
    const completedCount = tasks.filter(t => t.completed).length;
    allCountEl.textContent = `All: ${tasks.length}`;
    activeCountEl.textContent = `Active: ${activeCount}`;
    completedCountEl.textContent = `Completed: ${completedCount}`;
}

filterBtns.forEach(btn => {
    btn.onclick = () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filter = btn.dataset.filter;
        render();
    };
});

clearCompletedBtn.onclick = () => {
    tasks = tasks.filter(t => !t.completed);
    saveAndRender();
};

function openEditModal(task) {
    currentEditId = task.id;
    editInput.value = task.text;
    modal.style.display = 'flex';
    editInput.focus();
}
function closeEditModal() {
    modal.style.display = 'none';
    currentEditId = null;
}
saveEditBtn.onclick = () => {
    const newText = editInput.value.trim();
    if (newText && currentEditId) {
        tasks = tasks.map(task =>
            task.id === currentEditId ? { ...task, text: newText } : task
        );
        saveAndRender();
        closeEditModal();
    }
};
cancelEditBtn.onclick = closeEditModal;
closeModal.onclick = closeEditModal;
window.onclick = function(event) {
    if (event.target === modal) closeEditModal();
};

function saveAndRender() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    render();
}

render();
