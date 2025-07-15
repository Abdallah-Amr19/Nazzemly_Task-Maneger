 
const TASKS_KEY = "tasks-v2";
const BADGES_KEY = "badges-v2";
const LANG_KEY = "task-manager-lang";
let editingTaskIdx = null;
let onboardingStep = 0;
let currentLang = localStorage.getItem(LANG_KEY) || 'en';
const BADGES = [
  { id: "starter", name: "Starter", desc: "Added your first task!", icon: "star" },
  { id: "focus", name: "Focus", desc: "Completed a Pomodoro!", icon: "clock" },
  { id: "finisher", name: "Finisher", desc: "Completed 10 tasks!", icon: "award" },
  { id: "streak", name: "Streak", desc: "Completed 3 days in a row!", icon: "zap" },
];

 
const translations = {
  en: {
    menu: "Menu",
    allTasks: "All Tasks",
    today: "Today",
    completed: "Completed",
    tags: "Tags",
    stats: "Stats",
    guide: "Guide",
    theme: "Theme:",
    defaultTheme: "Default",
    blueGradient: "Blue Gradient",
    greenGradient: "Green Gradient",
    custom: "Custom",
    taskManager: "Task Manager",
    addTask: "Add Task",
    saveTask: "Save Task",
    cancel: "Cancel",
    low: "Low",
    medium: "Medium",
    high: "High",
    pomodoroTimer: "Pomodoro Timer",
    start: "Start",
    stop: "Stop",
    reset: "Reset",
    welcome: "Welcome!",
    taskName: "Task name...",
    description: "Description (optional)",
    tagsPlaceholder: "Tags (comma separated)",
    done: "Done",
    undo: "Undo",
    edit: "Edit",
    delete: "Delete",
    due: "Due:",
    startDate: "Start Date:",
    endDate: "End Date:",
    statistics: "Statistics",
    tasksCompleted: "Tasks completed this week:",
    mostUsedTag: "Most used tag:",
    totalTasks: "Total tasks:",
    completedTasks: "Completed:",
    pendingTasks: "Pending:"
  },
  ar: {
    menu: "القايمة",
    allTasks: "كل المهام",
    today: "النهاردة",
    completed: "المكتملة",
    tags: "التاجات",
    stats: "الاحصائيات",
    guide: "الشرح",
    theme: "اللون:",
    defaultTheme: "عادي",
    blueGradient: "جرادينت ازرق",
    greenGradient: "جرادينت اخضر",
    custom: "مخصص",
    taskManager: "مدير المهام",
    addTask: "ضيف مهمة",
    saveTask: "حفظ المهمة",
    cancel: "الغاء",
    low: "خفيفة",
    medium: "متوسطة",
    high: "مهمة",
    pomodoroTimer: "تايمر البومودورو",
    start: "ابدا",
    stop: "ايقاف",
    reset: "اعادة",
    welcome: "اهلا وسهلا!",
    taskName: "اسم المهمة...",
    description: "الوصف (اختياري)",
    tagsPlaceholder: "التاجات (مفصولة بفاصلة)",
    done: "تم",
    undo: "ارجعها",
    edit: "تعديل",
    delete: "مسح",
    due: "اخر موعد:",
    startDate: "تاريخ البدء:",
    endDate: "تاريخ الانتهاء:",
    statistics: "الاحصائيات",
    tasksCompleted: "المهام المكتملة الاسبوع ده:",
    mostUsedTag: "اكتر تاج مستخدم:",
    totalTasks: "كل المهام:",
    completedTasks: "المكتملة:",
    pendingTasks: "اللي لسه مخلصتهاش:",
    profile: "حسابي الشخصي",
    pending: "قيد الانتظار",
    edit: "تعديل",
    delete: "مسح",
    attachment: "مرفق",
    saveTask: "حفظ المهمة",
    cancel: "الغاء"
  }
};

 
function loadTasks() {
  return JSON.parse(localStorage.getItem(TASKS_KEY) || "[]");
}
function saveTasks(tasks) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}
function loadBadges() {
  return JSON.parse(localStorage.getItem(BADGES_KEY) || "[]");
}
function saveBadges(badges) {
  localStorage.setItem(BADGES_KEY, JSON.stringify(badges));
}
function uniqueTags(tasks) {
  const tags = new Set();
  tasks.forEach(t => (t.tags || []).forEach(tag => tags.add(tag)));
  return Array.from(tags);
}
function todayStr() {
  return new Date().toISOString().slice(0,10);
}

 
function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'ar' : 'en';
  localStorage.setItem(LANG_KEY, currentLang);
  applyLanguage();
}

function applyLanguage() {
  var startLabel = document.querySelector('label[for="task-start"]');
  var endLabel = document.querySelector('label[for="task-end"]');
  if (startLabel) startLabel.textContent = translations[currentLang].startDate;
  if (endLabel) endLabel.textContent = translations[currentLang].endDate;
  const t = translations[currentLang];
  if(document.querySelector('.sidebar h2')) document.querySelector('.sidebar h2').textContent = t.menu;
  if(document.getElementById('nav-all')) document.getElementById('nav-all').innerHTML = `<i data-feather="list"></i> ${t.allTasks}`;
  if(document.getElementById('nav-today')) document.getElementById('nav-today').innerHTML = `<i data-feather="sun"></i> ${t.today}`;
  if(document.getElementById('nav-completed')) document.getElementById('nav-completed').innerHTML = `<i data-feather="check-circle"></i> ${t.completed}`;
  if(document.getElementById('nav-tags')) document.getElementById('nav-tags').innerHTML = `<i data-feather="tag"></i> ${t.tags}`;
  if(document.getElementById('nav-stats')) document.getElementById('nav-stats').innerHTML = `<i data-feather="bar-chart-2"></i> ${t.stats}`;
  if(document.getElementById('nav-onboarding')) document.getElementById('nav-onboarding').innerHTML = `<i data-feather="help-circle"></i> ${t.guide}`;
  if(document.querySelector('.theme-picker label')) document.querySelector('.theme-picker label').textContent = t.theme;
  if(document.querySelector('#theme-select option[value="default"]')) document.querySelector('#theme-select option[value="default"]').textContent = t.defaultTheme;
  if(document.querySelector('#theme-select option[value="blue"]')) document.querySelector('#theme-select option[value="blue"]').textContent = t.blueGradient;
  if(document.querySelector('#theme-select option[value="green"]')) document.querySelector('#theme-select option[value="green"]').textContent = t.greenGradient;
  if(document.querySelector('#theme-select option[value="custom"]')) document.querySelector('#theme-select option[value="custom"]').textContent = t.custom;
  if(document.querySelector('#add-task-btn')) document.querySelector('#add-task-btn').title = t.addTask;
  if(document.querySelector('#task-form h2')) document.querySelector('#task-form h2').textContent = t.addTask;
  if(document.querySelector('#task-name')) document.querySelector('#task-name').placeholder = t.taskName;
  if(document.querySelector('#task-desc')) document.querySelector('#task-desc').placeholder = t.description;
  if(document.querySelector('#task-priority option[value="low"]')) document.querySelector('#task-priority option[value="low"]').textContent = t.low;
  if(document.querySelector('#task-priority option[value="medium"]')) document.querySelector('#task-priority option[value="medium"]').textContent = t.medium;
  if(document.querySelector('#task-priority option[value="high"]')) document.querySelector('#task-priority option[value="high"]').textContent = t.high;
  if(document.querySelector('#task-tags')) document.querySelector('#task-tags').placeholder = t.tagsPlaceholder;
  if(document.querySelector('#task-form button[type="submit"]')) document.querySelector('#task-form button[type="submit"]').textContent = t.saveTask;
  if(document.querySelector('#close-modal')) document.querySelector('#close-modal').textContent = t.cancel;
  if(document.querySelector('#pomodoro .clock_contaner')) document.querySelector('#pomodoro .clock_contaner').innerHTML = `<i data-feather="clock"></i> ${t.pomodoroTimer}`;
  if(document.querySelector('#start-pomodoro')) document.querySelector('#start-pomodoro').textContent = t.start;
  if(document.querySelector('#stop-pomodoro')) document.querySelector('#stop-pomodoro').textContent = t.stop;
  if(document.querySelector('#reset-pomodoro')) document.querySelector('#reset-pomodoro').textContent = t.reset;
  if(document.querySelector('#tags-section h3')) document.querySelector('#tags-section h3').textContent = t.tags;
  if(document.querySelector('#stats-section h3')) document.querySelector('#stats-section h3').textContent = t.statistics;
  if(document.querySelector('#onboarding-section h3')) document.querySelector('#onboarding-section h3').textContent = t.welcome;
  if(document.querySelector('#language-toggle span')) document.querySelector('#language-toggle span').textContent = currentLang === 'en' ? 'عربي' : 'English';

  document.body.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
 
  feather.replace();
  renderProgress();
  renderTasks(window.currentFilter || {});
  setTimeout(function() {
    document.querySelectorAll('.task-start').forEach(function(el){
      var date = el.innerHTML.replace(/^(Start Date:|تاريخ البدء:|تاريخ البدايه:|Start:|تاريخ النهايه:|End Date:|End:)/, '').trim();
      el.innerHTML = translations[currentLang].startDate + ' ' + date;
    });
    document.querySelectorAll('.task-end').forEach(function(el){
      var date = el.innerHTML.replace(/^(End Date:|تاريخ الانتهاء:|تاريخ النهايه:|End:|تاريخ البدء:|Start Date:|Start:)/, '').trim();
      el.innerHTML = translations[currentLang].endDate + ' ' + date;
    });
  }, 100);
}

 
function renderTasks(filter = {}) {
  const list = document.getElementById("task-list");
  const tasks = loadTasks();
  const t = translations[currentLang];
  let filtered = [];
  let mapping = [];

  tasks.forEach((task, i) => {
    if (filter.today && !task.done && (
      (task.deadline && task.deadline === todayStr()) ||
      (task.start && task.start === todayStr()) ||
      (task.end && task.end === todayStr())
    )) {
      filtered.push(task); mapping.push(i);
    } else if (filter.completed && task.done) {
      filtered.push(task); mapping.push(i);
    } else if (filter.tag && task.tags && task.tags.includes(filter.tag)) {
      filtered.push(task); mapping.push(i);
    } else if (!filter.today && !filter.completed && !filter.tag && !task.done) {
      filtered.push(task); mapping.push(i);
    }
  });

  list.innerHTML = "";
  filtered.forEach((task, idx) => {
    const li = document.createElement("li");
    li.className = `task-item ${task.priority}${task.done ? " done" : ""}`;
    li.setAttribute("draggable", "true");
    li.setAttribute("data-idx", idx);
    li.setAttribute("data-original-idx", mapping[idx]);
    li.setAttribute("data-start", task.start || '');
    li.setAttribute("data-end", task.end || '');

    let icon = "arrow-down-circle";
    if (task.priority === "high") icon = "alert-triangle";
    else if (task.priority === "medium") icon = "alert-circle";
    let tagsHTML = "";
    if (task.tags && task.tags.length)
      tagsHTML = `<div class="task-tags">${task.tags.map(tag => `<span class="tag">${tag}</span>`).join("")}</div>`;
    let attachHTML = "";
    if (task.attachment) {
      const fileName = task.attachment.name || 'Attachment';
      if (task.attachment.type.startsWith("image/")) {
        attachHTML = `<div class="task-attachment" style="margin-top:8px; margin-bottom:8px;">
          <a href="${task.attachment.data}" target="_blank" style="display:inline-block; border-radius:8px; border:1px solid #eee; overflow:hidden; box-shadow:0 2px 8px #0001; text-decoration:none;">
            <img src="${task.attachment.data}" alt="${fileName}" style="max-width:120px; max-height:120px; display:block; margin:auto;">
          </a>
          <div style="text-align:center; font-size:13px; color:#2563eb; margin-top:4px; word-break:break-all;">${fileName}</div>
        </div>`;
      } else if (task.attachment.type.startsWith("audio/")) {
        attachHTML = `<div class="task-attachment" style="margin-top:8px; margin-bottom:8px;">
          <a href="${task.attachment.data}" target="_blank" style="text-decoration:none; color:#2563eb; font-weight:500;">
            <audio src="${task.attachment.data}" controls style="width:100%; max-width:180px; display:block; margin:auto;"></audio>
            <div style="text-align:center; font-size:13px; color:#2563eb; margin-top:4px; word-break:break-all;">${fileName}</div>
          </a>
        </div>`;
      } else {
        attachHTML = `<div class="task-attachment" style="margin-top:8px; margin-bottom:8px;">
          <a href="${task.attachment.data}" target="_blank" style="text-decoration:none; color:#2563eb; font-weight:500; border-radius:6px; padding:4px 10px; background:#f3f6fd; border:1px solid #eee; display:inline-block;">${fileName}</a>
        </div>`;
      }
    }
        li.innerHTML = `
          <div class="task-details">
            <span class="task-title"><i data-feather="${icon}" class="priority-icon"></i> ${task.name}</span>
            ${task.deadline ? `<span class="task-deadline">${t.due} ${task.deadline}</span>` : ""}
            ${tagsHTML}
            ${task.desc ? `<span class="task-desc">${task.desc}</span>` : ""}
            <div class="task-dates">
              ${task.start ? `<span class="task-start">${t.startDate} ${task.start}</span>` : ""}
              ${task.end ? `<span class="task-end">${t.endDate} ${task.end}</span>` : ""}
            </div>
            ${attachHTML}
          </div>
          <div class="task-actions">
            <button class="done-btn"><i data-feather="check"></i> ${task.done ? t.undo : t.done}</button>
            <button class="edit-btn"><i data-feather="edit"></i> ${t.edit}</button>
            <button class="delete-btn"><i data-feather="trash-2"></i> ${t.delete}</button>
          </div>
        `;
    list.appendChild(li);
  });
  feather.replace();
  renderProgress();
  renderTagsSection();
  renderPomodoroTasks();
  scheduleReminders();
}

function renderProgress() {
  const tasks = loadTasks();
  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  const percent = total ? Math.round((done / total) * 100) : 0;
  document.getElementById("progress").style.width = percent + "%";
  const t = translations[currentLang];
  document.getElementById("progress-text").textContent = `${done}/${total} ${t.done} (${percent}%)`;
  checkBadges(done, total);
}

function renderTagsSection() {
  const tags = uniqueTags(loadTasks());
  const tagsList = document.getElementById("tags-list");
  tagsList.innerHTML = tags.map(tag => `<span class="tag" data-tag="${tag}">${tag}</span>`).join("");
}

function renderStatsSection() {
  const tasks = loadTasks();
  const t = translations[currentLang];
  const week = Array(7).fill(0);
  const now = new Date();
  tasks.forEach(t => {
    if (t.done && t.completedAt) {
      const d = new Date(t.completedAt);
      const diff = Math.floor((now - d) / (24*60*60*1000));
      if (diff < 7) week[6-diff]++;
    }
  });
  const tags = uniqueTags(tasks);
  let tagCounts = {};
  tags.forEach(tag => tagCounts[tag] = tasks.filter(t => t.tags && t.tags.includes(tag)).length);
  document.getElementById("stats-content").innerHTML = `
    <b>${t.tasksCompleted}</b> ${week.reduce((a,b)=>a+b,0)}<br>
    <b>${t.mostUsedTag}</b> ${Object.entries(tagCounts).sort((a,b)=>b[1]-a[1])[0]?.[0] || (currentLang === 'en' ? "None" : "لا يوجد")}<br>
    <b>${t.totalTasks}</b> ${tasks.length}<br>
    <b>${t.completedTasks}</b> ${tasks.filter(t=>t.done).length}<br>
    <b>${t.pendingTasks}</b> ${tasks.filter(t=>!t.done).length}
  `;
}

function renderBadges() {
  const badges = loadBadges();
  const container = document.getElementById("achievement-badges");
  if (!container) return;
  container.innerHTML = "";
  BADGES.forEach(badge => {
    if (badges.includes(badge.id)) {
      container.innerHTML += `<span title="${badge.desc}"><i data-feather="${badge.icon}"></i></span>`;
    }
  });
  feather.replace();
}

function renderPomodoroTasks() {
  const select = document.getElementById("pomodoro-task");
  if (!select) return;
  const tasks = loadTasks().filter(t => !t.done);
  select.innerHTML = tasks.map((t, i) => `<option value="${i}">${t.name}</option>`).join("");
}

 
function openTaskModal(task = null, idx = null) {
  editingTaskIdx = idx;
  document.getElementById("task-modal").classList.add("show");
  document.getElementById("task-form").reset();
  document.getElementById("task-name").value = task?.name || "";
  document.getElementById("task-desc").value = task?.desc || "";
  document.getElementById("task-deadline").value = task?.deadline || "";
  document.getElementById("task-priority").value = task?.priority || "medium";
  document.getElementById("task-tags").value = task?.tags?.join(", ") || "";
  document.getElementById("task-attachment").value = "";
  document.getElementById("task-start").value = task?.start || "";
  document.getElementById("task-end").value = task?.end || "";
}
function closeTaskModal() {
  editingTaskIdx = null;
  document.getElementById("task-modal").classList.remove("show");
}

 
document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("add-task-btn").onclick = () => openTaskModal();
  document.getElementById("close-modal").onclick = closeTaskModal;

  document.getElementById("task-form").onsubmit = async function(e) {
    e.preventDefault();
    const name = document.getElementById("task-name").value.trim();
    const desc = document.getElementById("task-desc").value.trim();
    const deadline = document.getElementById("task-deadline") ? document.getElementById("task-deadline").value : "";
    const start = document.getElementById("task-start") ? document.getElementById("task-start").value : "";
    const end = document.getElementById("task-end") ? document.getElementById("task-end").value : "";
    const priority = document.getElementById("task-priority").value;
    const tags = document.getElementById("task-tags").value.split(",").map(t => t.trim()).filter(Boolean);
    let attachment = null;
    const file = document.getElementById("task-attachment").files[0];
    if (file) {
      attachment = { type: file.type, name: file.name, data: await fileToBase64(file) };
    }
    let tasks = loadTasks();
    if (editingTaskIdx !== null) {
      tasks[editingTaskIdx] = { ...tasks[editingTaskIdx], name, desc, deadline, start, end, priority, tags, attachment };
    } else {
      tasks.push({ name, desc, deadline, start, end, priority, tags, done: false, attachment });
    }
    saveTasks(tasks);
    closeTaskModal();
    renderTasks(window.currentFilter || {});
    renderBadges();
    renderStatsSection();
    if (tasks.length === 1) unlockBadge("starter");
  };

  document.getElementById("task-list").onclick = function(e) {
    const li = e.target.closest(".task-item");
    if (!li) return;
    const originalIdx = parseInt(li.getAttribute("data-original-idx"));
    let tasks = loadTasks();
    if (e.target.closest(".delete-btn")) {
      tasks.splice(originalIdx, 1);
    } else if (e.target.closest(".done-btn")) {
      tasks[originalIdx].done = !tasks[originalIdx].done;
      if (tasks[originalIdx].done) {
        tasks[originalIdx].completedAt = new Date().toISOString();
      } else {
        delete tasks[originalIdx].completedAt;
      }
    } else if (e.target.closest(".edit-btn")) {
      openTaskModal(tasks[originalIdx], originalIdx);
      return;
    }
    saveTasks(tasks);
    renderTasks(window.currentFilter || {});
    renderBadges();
    renderStatsSection();
    if (tasks.filter(t => t.done).length === 10) unlockBadge("finisher");
  };

  document.getElementById("tags-list").onclick = function(e) {
    if (e.target.classList.contains("tag")) {
      renderTasks({ tag: e.target.getAttribute("data-tag") });
    }
  };

  document.getElementById('language-toggle').addEventListener('click', toggleLanguage);

  window.currentFilter = {};
  document.getElementById("nav-all").onclick = function() { window.currentFilter = {}; showSection("task-section"); renderTasks(window.currentFilter); activateNav("nav-all"); };
  document.getElementById("nav-today").onclick = function() { window.currentFilter = { today: true }; showSection("task-section"); renderTasks(window.currentFilter); activateNav("nav-today"); };
  document.getElementById("nav-completed").onclick = function() { window.currentFilter = { completed: true }; showSection("task-section"); renderTasks(window.currentFilter); activateNav("nav-completed"); };
  document.getElementById("nav-tags").onclick = function() { window.currentFilter = {}; showSection("tags-section"); activateNav("nav-tags"); };
  document.getElementById("nav-stats").onclick = function() { window.currentFilter = {}; showSection("stats-section"); renderStatsSection(); activateNav("nav-stats"); };
  document.getElementById("nav-onboarding").onclick = function() { window.currentFilter = {}; showSection("onboarding-section"); onboardingStep = 0; renderOnboarding(); activateNav("nav-onboarding"); };

  document.getElementById("task-modal").addEventListener("click", function(e) {
    if (e.target === this) closeTaskModal();
  });

  const darkCheckbox = document.querySelector('.theme-switch__checkbox');
  if (darkCheckbox) {
    darkCheckbox.addEventListener('change', function() {
      document.body.classList.toggle('dark', this.checked);
      localStorage.setItem('darkMode', this.checked ? '1' : '0');
    });
  }

  const menu = document.getElementById('circularMenu');
  const toggleOpen = document.getElementById('menu-toggle_open');
  const toggleClose = document.getElementById('menu-toggle_close');
  if (toggleOpen && toggleClose) {
    toggleOpen.addEventListener('click', () => {
      menu.classList.add('open');
      toggleOpen.style.display = 'none';
      toggleClose.style.display = 'block';
    });
    toggleClose.addEventListener('click', () => {
      menu.classList.remove('open');
      toggleOpen.style.display = 'block';
      toggleClose.style.display = 'none';
    });
    toggleOpen.style.display = 'block';
    toggleClose.style.display = 'none';
  }
  document.querySelectorAll('.circular-menu .menu-item').forEach(item => {
    item.addEventListener('click', function() {
      const target = this.getAttribute('data-target');
      document.getElementById(target).click();
      menu.classList.remove('open');
      if (toggleOpen && toggleClose) {
        toggleOpen.style.display = 'inline-block';
        toggleClose.style.display = 'none';
      }
    });
  });

  let dragSrcIdx = null;
  document.getElementById("task-list").addEventListener("dragstart", function(e) {
    const li = e.target.closest(".task-item");
    if (!li) return;
    dragSrcIdx = parseInt(li.getAttribute("data-original-idx"));
    li.style.opacity = "0.5";
  });
  document.getElementById("task-list").addEventListener("dragend", function(e) {
    const li = e.target.closest(".task-item");
    if (li) li.style.opacity = "";
  });
  document.getElementById("task-list").addEventListener("dragover", function(e) {
    e.preventDefault();
  });
  document.getElementById("task-list").addEventListener("drop", function(e) {
    e.preventDefault();
    const li = e.target.closest(".task-item");
    if (!li || dragSrcIdx === null) return;
    const dropOriginalIdx = parseInt(li.getAttribute("data-original-idx"));
    if (dragSrcIdx === dropOriginalIdx) return;
    let tasks = loadTasks();
    const [moved] = tasks.splice(dragSrcIdx, 1);
    tasks.splice(dropOriginalIdx, 0, moved);
    saveTasks(tasks);
    renderTasks(window.currentFilter || {});
    dragSrcIdx = null;
  });

  if (localStorage.getItem("darkMode") === "1") {
    document.body.classList.add("dark");
    if (darkCheckbox) darkCheckbox.checked = true;
  } else {
    document.body.classList.remove("dark");
    if (darkCheckbox) darkCheckbox.checked = false;
  }
  applyLanguage();
  renderTasks();
  renderBadges();
  renderStatsSection();
  feather.replace();
});

 
function fileToBase64(file) {
  return new Promise(res => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result);
    reader.readAsDataURL(file);
  });
}

function showSection(id) {
  document.getElementById("task-section").style.display = "none";
  document.getElementById("tags-section").style.display = "none";
  document.getElementById("stats-section").style.display = "none";
  document.getElementById("onboarding-section").style.display = "none";
  document.getElementById(id).style.display = "";
}

function activateNav(id) {
  document.querySelectorAll(".sidebar nav button").forEach(btn => btn.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

 
function scheduleReminders() {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") Notification.requestPermission();
  const tasks = loadTasks();
  window._reminderTimeouts?.forEach(clearTimeout);
  window._reminderTimeouts = [];
  tasks.forEach(task => {
    if (task.deadline && !task.done) {
      const due = new Date(task.deadline + "T23:59:59").getTime();
      const now = Date.now();
      if (due > now && due - now < 24*60*60*1000) {
        const timeout = setTimeout(() => {
          new Notification(currentLang === 'en' ? "Task Reminder" : "تذكير بالمهمة", {
            body: `${task.name}\n${currentLang === 'en' ? 'Due:' : 'الموعد النهائي:'} ${task.deadline}`,
          });
        }, due - now);
        window._reminderTimeouts.push(timeout);
      }
    }
  });
}

 
function unlockBadge(badgeId) {
  let badges = loadBadges();
  if (!badges.includes(badgeId)) {
    badges.push(badgeId);
    saveBadges(badges);
    renderBadges();
  }
}
function checkBadges(done, total) {
  if (done >= 10) unlockBadge("finisher");
  const tasks = loadTasks();
  let streak = 0;
  for (let i = 0; i < 3; i++) {
    const day = new Date(Date.now() - i*24*60*60*1000).toISOString().slice(0,10);
    if (tasks.some(t => t.done && t.completedAt && t.completedAt.slice(0,10) === day)) streak++;
    else break;
  }
  if (streak === 3) unlockBadge("streak");
}

 
let pomoInterval = null, pomoSeconds = 25*60;
function updatePomodoro() {
  const timer = document.getElementById("pomodoro-timer");
  timer.textContent = `${String(Math.floor(pomoSeconds/60)).padStart(2,"0")}:${String(pomoSeconds%60).padStart(2,"0")}`;
}
document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("start-pomodoro").onclick = function() {
    if (pomoInterval) return;
    pomoInterval = setInterval(() => {
      if (pomoSeconds > 0) {
        pomoSeconds--;
        updatePomodoro();
      } else {
        clearInterval(pomoInterval);
        pomoInterval = null;
        unlockBadge("focus");
        alert(currentLang === 'en' ? "Pomodoro complete!" : "اكتملت جلسة البومودورو!");
      }
    }, 1000);
  };
  document.getElementById("stop-pomodoro").onclick = function() {
    clearInterval(pomoInterval);
    pomoInterval = null;
  };
  document.getElementById("reset-pomodoro").onclick = function() {
    clearInterval(pomoInterval);
    pomoInterval = null;
    pomoSeconds = 25*60;
    updatePomodoro();
  };
  updatePomodoro();
});

 
const onboardingSteps = {
  en: [
    "Welcome to the Creative Student Task Manager! 🎉<br>Let's take a quick tour.",
    "Sidebar: Quickly navigate between all tasks, today's tasks, completed, tags, and stats.",
    "Add new tasks using the floating action button. You can also use add attachments!",
    "Use the Pomodoro timer to boost your productivity.",
    "Earn achievement badges for your progress and consistency.",
    "That's it! Enjoy a productive and organized student life! 🚀"
  ],
  ar: [
    "مرحباً بك في مدير مهام الطلاب الإبداعي! 🎉<br>لنأخذ جولة سريعة.",
    "الشريط الجانبي: تنقل بسرعة بين جميع المهام ومهام اليوم والمكتملة والوسوم والإحصائيات.",
    "أضف مهام جديدة باستخدام زر الإضافة العائم. يمكنك أيضاً استخدام  إضافة مرفقات!",
    "استخدم مؤقت البومودورو لزيادة إنتاجيتك.",
    "احصل على شارات إنجاز لتقدمك واستمراريتك.",
    "هذا كل شيء! استمتع بحياة طلابية منتظمة ومنظمة! 🚀"
  ]
};
function renderOnboarding() {
  const content = document.getElementById("onboarding-content");
  const t = translations[currentLang];
  content.innerHTML = `<div>${onboardingSteps[currentLang][onboardingStep]}</div>
    <div style="margin-top:12px;">
      ${onboardingStep > 0 ? `<button id="onboard-prev">${currentLang === 'en' ? 'Previous' : 'السابق'}</button>` : ""}
      ${onboardingStep < onboardingSteps.en.length-1 ? `<button id="onboard-next">${currentLang === 'en' ? 'Next' : 'التالي'}</button>` : `<button id="onboard-close">${currentLang === 'en' ? 'Close' : 'إغلاق'}</button>`}
    </div>`;
  if (onboardingStep > 0) document.getElementById("onboard-prev").onclick = () => { onboardingStep--; renderOnboarding(); };
  if (onboardingStep < onboardingSteps.en.length-1) document.getElementById("onboard-next").onclick = () => { onboardingStep++; renderOnboarding(); };
  if (onboardingStep === onboardingSteps.en.length-1) document.getElementById("onboard-close").onclick = () => { showSection("task-section"); activateNav("nav-all"); };
}

function renderSidebarUser() {
      const userDiv = document.getElementById('sidebar-user');
      const authDiv = document.getElementById('sidebar-auth');
      const mobileProfileContainer = document.getElementById('mobile-profile-container');
      const mobileProfileImg = document.getElementById('mobile-profile-img');
      const mobileProfileLabel = document.getElementById('mobile-profile-label');
      const mobileProfileDropdown = document.getElementById('mobile-profile-dropdown');
      if (!userDiv || !authDiv || !mobileProfileContainer || !mobileProfileImg || !mobileProfileLabel || !mobileProfileDropdown) return;
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      const lang = localStorage.getItem('task-manager-lang') || 'en';
      const isMobile = window.innerWidth <= 900;
      if (user && user.name) {
        userDiv.innerHTML = `
          ${user.picture ? `<img src="${user.picture}" alt="User">` : ''}
          <div>${user.name}</div>
          ${user.email ? `<div style="font-size:13px;color:#666;">${user.email}</div>` : ''}
          <button id="logout-btn" class="sidebar-auth-btn" style="background:#ef4444;margin-top:10px;">${lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}</button>
        `;
        authDiv.innerHTML = '';
        setTimeout(() => {
          const logoutBtn = document.getElementById('logout-btn');
          if (logoutBtn) {
            logoutBtn.onclick = function() {
              localStorage.removeItem('user');
              window.location.href = 'login.html';
            };
          }
        }, 100);
        if (window.innerWidth <= 600) {
          mobileProfileContainer.style.display = 'block';
          if (user.picture) {
            mobileProfileImg.src = user.picture;
            mobileProfileImg.style.display = 'inline-block';
          } else {
            mobileProfileImg.style.display = 'none';
          }
          mobileProfileLabel.style.display = 'inline-block';
          mobileProfileLabel.textContent = lang === 'ar' ? 'حسابي الشخصي' : 'my profile';
          mobileProfileDropdown.style.display = 'none';
          mobileProfileDropdown.innerHTML = `
            <div style="padding:10px 0 0 0;">
              <div style="font-weight:bold;color:#2563eb;font-size:15px;">${user.name}</div>
              ${user.email ? `<div style="font-size:13px;color:#888;margin-bottom:6px;">${user.email}</div>` : ''}
              <button id="logout-btn-mobile" style="background:#ef4444;color:#fff;font-size:13px;padding:5px 0;border:none;border-radius:8px;width:80px;">${lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}</button>
            </div>
          `;
          mobileProfileLabel.onclick = function(e) {
            e.stopPropagation();
            mobileProfileDropdown.style.display = mobileProfileDropdown.style.display === 'block' ? 'none' : 'block';
          };
          document.body.addEventListener('click', function hideDropdown(e) {
            if (!mobileProfileContainer.contains(e.target)) {
              mobileProfileDropdown.style.display = 'none';
              document.body.removeEventListener('click', hideDropdown);
            }
          });
          setTimeout(() => {
            const logoutBtn = document.getElementById('logout-btn-mobile');
            if (logoutBtn) {
              logoutBtn.onclick = function() {
                localStorage.removeItem('user');
                window.location.href = 'login.html';
              };
            }
          }, 100);
        } else {
          mobileProfileContainer.style.display = 'none';
        }
      } else {
        userDiv.innerHTML = '';
        authDiv.innerHTML = `
          <a href="login.html" class="sidebar-auth-btn">${lang === 'ar' ? 'تسجيل الدخول' : 'Login'}</a>
          <a href="signup.html" class="sidebar-auth-btn">${lang === 'ar' ? 'إنشاء حساب' : 'Signup'}</a>
        `;
        mobileProfileContainer.style.display = 'none';
        const topAuthBtns = document.getElementById('top-auth-btns');
        if (topAuthBtns) {
          topAuthBtns.innerHTML = `
            <a href="login.html" class="top-auth-btn">${lang === 'ar' ? 'تسجيل الدخول' : 'Login'}</a>
            <a href="signup.html" class="top-auth-btn">${lang === 'ar' ? 'إنشاء حساب' : 'Signup'}</a>
          `;
        }
      }
    }
    document.addEventListener('DOMContentLoaded', renderSidebarUser);
    window.addEventListener('storage', renderSidebarUser);
    window.addEventListener('resize', renderSidebarUser);
    document.getElementById('language-toggle').addEventListener('click', function() {
      setTimeout(renderSidebarUser, 300);
    });

    function addGoogleCalendarButtons() {
  setTimeout(function() {
    document.querySelectorAll('.task-item').forEach(function(li) {
      if (!li.querySelector('.google-calendar-btn')) {
        const btn = document.createElement('button');
        btn.className = 'google-calendar-btn';
        btn.innerHTML = `<svg viewBox='0 0 24 24'><path fill='currentColor' d='M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zm0-13H5V5h14v1z'/></svg> <span>Google Calendar</span>`;
        btn.onclick = function(e) {
          e.stopPropagation();
          const title = li.querySelector('.task-title')?.textContent?.trim() || 'Task';
          const desc = li.querySelector('.task-desc')?.textContent?.trim() || '';
          const start = li.getAttribute('data-start') || new Date().toISOString().slice(0,10);
          const end = li.getAttribute('data-end') || start;
          function formatDate(dateStr) {
            const d = new Date(dateStr);
            return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
          }
          const startStr = formatDate(start);
          const endStr = formatDate(end);
          const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(desc)}&dates=${startStr}/${endStr}`;
          window.open(url, '_blank');
        };
        li.querySelector('.task-actions').appendChild(btn);
      }
      const endDateStr = li.getAttribute('data-end');
      if (endDateStr) {
        const endDate = new Date(endDateStr);
        const today = new Date();
        endDate.setHours(0,0,0,0);
        today.setHours(0,0,0,0);
        const diffDays = Math.round((endDate - today) / (1000 * 60 * 60 * 24));
        if (diffDays === 1 && !li.getAttribute('data-reminder-sent')) {
          li.setAttribute('data-reminder-sent', '1');
          const title = li.querySelector('.task-title')?.textContent?.trim() || 'Task';
          const desc = li.querySelector('.task-desc')?.textContent?.trim() || '';
          const start = li.getAttribute('data-start') || new Date().toISOString().slice(0,10);
          const user = JSON.parse(localStorage.getItem('user') || 'null');
          const email = user && user.email ? user.email : '';
          fetch('https://your-reminder-api.com/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title,
              desc,
              start,
              end: endDateStr,
              email 
            })
          })
          .then(function(res) { return res.json(); })
          .then(function(data) {
            console.log('Reminder sent for task:', title, 'to', email);
          })
          .catch(function(err) {
            console.error('Reminder error:', err);
          });
        }
      }
    });
  }, 500);
}
const origRenderTasks = window.renderTasks;
window.renderTasks = function() {
  origRenderTasks.apply(this, arguments);
  addGoogleCalendarButtons();
};