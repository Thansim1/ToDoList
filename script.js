const form = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const prioritySelect = document.getElementById("priority-select");
const repeatSelect = document.getElementById("repeat-select");
const dueDateInput = document.getElementById("due-date");
const taskList = document.getElementById("task-list");
const totalCount = document.getElementById("total-count");
const completedCount = document.getElementById("completed-count");
const toggleTheme = document.getElementById("toggle-theme");

function loadParticles() {
  particlesJS("particles-js", {
    particles: {
      number: { value: 50 },
      color: { value: "#ffffff" },
      shape: { type: "circle" },
      opacity: { value: 0.4 },
      size: { value: 3 },
      line_linked: {
        enable: true,
        color: "#ffffff",
        opacity: 0.4,
        width: 1
      },
      move: { enable: true, speed: 1.2 }
    },
    interactivity: {
      events: { onhover: { enable: true, mode: "repulse" } },
      modes: { repulse: { distance: 100 } }
    }
  });
}

const savedTheme = localStorage.getItem("theme") || "light";
if (savedTheme === "dark") {
  document.body.classList.add("dark");
}
loadParticles();

toggleTheme.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const newTheme = document.body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("theme", newTheme);
  document.getElementById("particles-js").innerHTML = "";
  loadParticles();
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const text = taskInput.value.trim();
  const priority = prioritySelect.value;
  const repeat = repeatSelect.value;
  const dueDate = dueDateInput.value;

  if (text !== "") {
    addTask(text, priority, repeat, dueDate);
    saveTask({ text, completed: false, priority, repeat, dueDate });
    taskInput.value = "";
    dueDateInput.value = "";
  }
});

function addTask(text, priority, repeat, dueDate, completed = false) {
  const li = document.createElement("li");
  if (completed) li.classList.add("completed");

  const top = document.createElement("div");
  top.className = "task-main";

  const span = document.createElement("span");
  span.textContent = text;
  span.onclick = () => editTask(span);

  const buttons = document.createElement("span");
  const doneBtn = document.createElement("button");
  doneBtn.innerHTML = "✔️";
  doneBtn.onclick = () => {
    li.classList.toggle("completed");
    updateStorage();
  };

  const delBtn = document.createElement("button");
  delBtn.innerHTML = "🗑️";
  delBtn.onclick = () => {
    li.remove();
    updateStorage();
  };

  buttons.appendChild(doneBtn);
  buttons.appendChild(delBtn);
  top.appendChild(span);
  top.appendChild(buttons);

  const meta = document.createElement("div");
  meta.className = "task-meta";
  meta.innerHTML = `
    <span class="priority-${priority.toLowerCase()}">Priority: ${priority}</span>
    <span>Repeat: ${repeat}</span>
    ${dueDate ? `<span>Due: ${dueDate}</span>` : ""}
  `;

  li.appendChild(top);
  li.appendChild(meta);
  taskList.appendChild(li);
  updateSummary();
}

function editTask(span) {
  const input = document.createElement("input");
  input.type = "text";
  input.value = span.textContent;
  input.classList.add("editable");

  input.onblur = () => {
    if (input.value.trim() !== "") {
      span.textContent = input.value.trim();
      updateStorage();
    } else {
      span.textContent = input.value;
    }
    span.onclick = () => editTask(span);
    input.replaceWith(span);
  };

  span.replaceWith(input);
  input.focus();
}

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTask(task) {
  const tasks = getTasks();
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  updateSummary();
}

function loadTasks() {
  const tasks = getTasks();
  tasks.forEach(task => {
    addTask(task.text, task.priority, task.repeat, task.dueDate, task.completed);
  });
  updateSummary();
}

function updateStorage() {
  const tasks = [];
  document.querySelectorAll("#task-list li").forEach(li => {
    const text = li.querySelector(".task-main span").textContent;
    const priority = li.querySelector(".task-meta span:nth-child(1)").textContent.split(": ")[1];
    const repeat = li.querySelector(".task-meta span:nth-child(2)").textContent.split(": ")[1];
    const dueDateText = li.querySelector(".task-meta span:nth-child(3)");
    const dueDate = dueDateText ? dueDateText.textContent.split(": ")[1] : "";
    tasks.push({
      text,
      completed: li.classList.contains("completed"),
      priority,
      repeat,
      dueDate
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  updateSummary();
}

function updateSummary() {
  const tasks = document.querySelectorAll("#task-list li");
  const completed = document.querySelectorAll("#task-list li.completed");
  totalCount.textContent = tasks.length;
  completedCount.textContent = completed.length;
}

window.onload = loadTasks;
