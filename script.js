document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.getElementById("task-form");
  const taskInput = document.getElementById("task-input");
  const taskList = document.getElementById("task-list");
  const toggleTheme = document.getElementById("toggle-theme");
  const totalSpan = document.getElementById("total");
  const completedSpan = document.getElementById("completed");

  const priority = document.getElementById("priority");
  const repeat = document.getElementById("repeat");
  const dueDate = document.getElementById("due-date");

  let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function renderTasks() {
    taskList.innerHTML = "";
    let completedCount = 0;

    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      if (task.completed) {
        li.classList.add("completed");
        completedCount++;
      }

      li.innerHTML = `
        <div class="task-main">
          <span>${task.text}</span>
          <div>
            <button onclick="completeTask(${index})">✔️</button>
            <button onclick="deleteTask(${index})">🗑️</button>
          </div>
        </div>
        <div class="task-meta">
          <span class="priority-${task.priority}">Priority: ${task.priority}</span>
          <span>Repeat: ${task.repeat}</span>
          <span>Due: ${task.dueDate}</span>
        </div>
      `;

      taskList.appendChild(li);
    });

    totalSpan.textContent = tasks.length;
    completedSpan.textContent = completedCount;
  }

  window.completeTask = function (index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
  };

  window.deleteTask = function (index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  };

  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (text === "") return;

    tasks.push({
      text,
      priority: priority.value,
      repeat: repeat.value,
      dueDate: dueDate.value,
      completed: false
    });

    taskInput.value = "";
    dueDate.value = "";
    saveTasks();
    renderTasks();
  });

  toggleTheme.addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });

  renderTasks();
});

// Particle background
particlesJS("particles-js", {
  particles: {
    number: { value: 45 },
    color: { value: "#ffffff" },
    shape: { type: "circle" },
    opacity: { value: 0.5 },
    size: { value: 3 },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#ffffff",
      opacity: 0.4,
      width: 1
    },
    move: {
      enable: true,
      speed: 2
    }
  },
  interactivity: {
    events: {
      onhover: { enable: true, mode: "repulse" }
    }
  },
  retina_detect: true
});
