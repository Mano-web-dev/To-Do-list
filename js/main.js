const time = document.querySelector(".time");
const day = document.querySelector(".day");
const add = document.querySelector("#add");
const task_time = document.querySelectorAll(".time:not(:first-child)");
const input = document.querySelector("#task");
const list = document.querySelector(".task-list");
let tasks = JSON.parse(localStorage.getItem("tasks"));

if (!tasks) {
  tasks = [
    {
      id: Date.now(),
      title: "Try Our ToDo List",
      time: new Date().toLocaleTimeString(),
      done: false,
      completedAt: null
    },
  ];
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function timer() {
  time.innerHTML = new Date().toLocaleTimeString();
  setInterval(() => {
    time.innerHTML = new Date().toLocaleTimeString();
  }, 1000);

  day.innerHTML = new Date().toDateString();
}
function renderTasks() {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].title !== "" || tasks[i].title === "Try Our ToDo List") {
      const li = document.createElement("li");
      li.className = "task";
      li.dataset.id = tasks[i].id;
      li.innerHTML = `
      <h2>${tasks[i].title}</h2>
      <span class="time">${tasks[i].time}</span>
      <div class="menu">
      <button class="del"><i class="fa-solid fa-trash"></i></i></button>
      <button class="done"><i class="fa-solid fa-check"></i></i></button>
      </div>
      `;
      if (tasks[i].done) {
        li.classList.add("tdone");
        // const del = li.querySelector(".del");
        // del.disabled = true;
      }
      list.appendChild(li);
    }
  }
}

function addTasks() {
  add.addEventListener("click", function () {
    if (!input.value.trim()) return;
    if (tasks.some((task) => task.title === input.value)) return;
    const li = document.createElement("li");
    li.classList = "task";
    li.innerHTML = `
      <h2>${input.value}</h2>
      <span class="time">${new Date().toLocaleTimeString()}</span>
      <div class="menu">
        <button class="del"><i class="fa-solid fa-trash"></i></i></button>
        <button class="done"><i class="fa-solid fa-check"></i></i></button>
      </div>
      `;
    const id = Date.now();
    li.dataset.id = id;
    list.appendChild(li);
    tasks.push({
      id: id,
      title: input.value,
      time: new Date().toLocaleTimeString(),
      done: false,
      completedAt: null
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    input.value = "";
  });
}


function delOrDoneTask() {
  list.addEventListener("click", function (e) {
    const taskItem = e.target.closest(".task");
    if (!taskItem) return;

    if (e.target.closest(".del")) {
      const title = taskItem.querySelector("h2").innerText;

      taskItem.remove();
      const index = tasks.findIndex((task) => task.title === title);
      if (index > -1) {
        tasks.splice(index, 1);
        localStorage.setItem("tasks", JSON.stringify(tasks));
      }
    }
    if (e.target.closest(".done")) {
      const id = Number(taskItem.dataset.id);
      const task = tasks.find((t) => t.id === id);

      if (!task || task.done) return;

      task.done = true;
      task.completedAt = new Date().toISOString();
      taskItem.classList.add("tdone");
      // const del = task.querySelector(".del")
      // del.disabled = true;
      popup()
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  });
}

function popup() {
  const div = document.createElement("div");
  const overlay = document.createElement("div");
  const sentence = ["اشطر كتكوت😂❤", "عاش يا بطل 👏", "ممتاز… كمل كده",
    "كل مهمة بتقربك لهدفك", "برافو عليك، ركّز وكمل","خلصتها؟ جامد 😎",
    "المهمة قالت سلام 😄"
  ]
  overlay.className = "overlay"
  div.className = "popup";
  div.innerHTML = `
  <button class="quit"><i class="fa-solid fa-x"></i></i></button>
  <h1>${sentence[Math.floor(Math.random() * sentence.length)]}</h1>
  `;
  document.body.append(div, overlay);
  const audio = new Audio("media/celebration.mp3");
  audio.volume = 1;
  audio.currentTime = 0
  audio.play().catch((err) => {
    // تجاهل الخطأ لأنه طبيعي
  });
  setTimeout(() => {
    div.remove();
    overlay.remove();
    audio.pause()
  }, 11000);
  const quite = div.querySelector(".quit");
  quite.addEventListener("click", () => {
    let fadeout = setInterval(() => {
      if (audio.volume > 0.05) {
        audio.volume -= 0.05;
      } else {
        audio.volume = 0;
        audio.pause();
        audio.currentTime = 0;
        clearInterval(fadeout);
      }
    }, 70);
    div.remove();
    overlay.remove();
  })




  const duration = 5 * 1000,
    animationEnd = Date.now() + duration,
    defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    // since particles fall down, start a bit higher than random
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      }),
    );
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      }),
    );
  }, 250);
}

function removeOldCompletedTasks() {
  const now = new Date();

  tasks = tasks.filter((task) => {
    if (!task.done) return true; // المهمة مش معمولة، خليها
    const completedAt = new Date(task.completedAt);
    const diffDays = (now - completedAt) / (1000 * 60 * 60 * 24); // فرق الأيام
    return diffDays <= 1; // خلي المهمة أقل من يوم
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}
window.onload = () => {
  timer();
  removeOldCompletedTasks()
  renderTasks();
  addTasks();
  delOrDoneTask();
}
