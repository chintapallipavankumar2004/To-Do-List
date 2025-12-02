// app.js - frontend logic (works with your existing Spring Boot endpoints)
(() => {
  const API_BASE = 'http://127.0.0.1:8080'; // change if your backend host/port differs

  // elements
  const listEl = document.getElementById('task-list');
  const loadingEl = document.getElementById('loading');
  const emptyEl = document.getElementById('empty');
  const todoBtn = document.getElementById('btn-todo');
  const compBtn = document.getElementById('btn-completed');
  const allBtn = document.getElementById('btn-all');
  const form = document.getElementById('add-form');
  const input = document.getElementById('task-input');

  let currentFilter = 'todo'; // 'todo' | 'completed' | 'all'
  let cache = [];

  const showLoading = (flag=true) => loadingEl.style.display = flag ? 'block' : 'none';
  const showEmpty = (flag=true) => emptyEl.style.display = flag ? 'block' : 'none';
  function setActive(btn){ [todoBtn, compBtn, allBtn].forEach(b=>b.classList.remove('active')); btn.classList.add('active'); }

  // fetch tasks from backend
  async function fetchTasks(){
    showLoading(true);
    try {
      const res = await fetch(`${API_BASE}/tasks`);
      const data = await res.json();
      cache = Array.isArray(data) ? data : [];
      renderList();
    } catch(err){
      console.error('fetch error', err);
      listEl.innerHTML = `<li class="task-item"><div class="left"><div class="task-name" style="color:tomato">Unable to contact API</div></div></li>`;
    } finally { showLoading(false); }
  }

  // render tasks (ID is not shown in UI)
  function renderList(){
    listEl.innerHTML = '';
    let tasks = cache.slice().reverse(); // newest first
    if (currentFilter === 'todo') tasks = tasks.filter(t => !Boolean(t.status));
    if (currentFilter === 'completed') tasks = tasks.filter(t => Boolean(t.status));
    if (tasks.length === 0) { showEmpty(true); return; } else showEmpty(false);

    tasks.forEach(task => {
      const li = document.createElement('li'); li.className = 'task-item';

      const left = document.createElement('div'); left.className = 'left';
      const nameSpan = document.createElement('div'); nameSpan.className = 'task-name';
      nameSpan.textContent = task.name || '(no title)';
      if (task.status) nameSpan.classList.add('done');

      left.appendChild(nameSpan);

      const controls = document.createElement('div'); controls.className = 'controls';
      const toggle = document.createElement('button'); toggle.className = 'btn-mini btn-done';
      toggle.textContent = task.status ? 'Mark undone' : 'Mark done';
      toggle.onclick = () => toggleStatus(task);

      const del = document.createElement('button'); del.className = 'btn-mini btn-del';
      del.textContent = 'Delete';
      del.onclick = () => removeTask(task);

      controls.appendChild(toggle);
      controls.appendChild(del);

      li.appendChild(left);
      li.appendChild(controls);

      listEl.appendChild(li);
    });
  }

  // add task: try backend auto-id first; if backend expects id, fallback with client id
  async function addTask(name){
    if (!name || !name.trim()) return;
    const payload = { name: name.trim(), status: false };

    try {
      // try POSTing without id (preferred)
      let res = await fetch(`${API_BASE}/addtask`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        // fallback: backend wants id => generate client id
        const clientId = Date.now() % 1000000;
        const payloadWithId = { id: clientId, ...payload };
        res = await fetch(`${API_BASE}/addtask`, {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify(payloadWithId)
        });
      }

      if (res.ok) {
        input.value = '';
        await fetchTasks();
      } else {
        console.error('Add failed', res.status);
      }
    } catch(e){
      console.error('Add error', e);
    }
  }

  // delete task by id
  async function removeTask(task){
    if (!confirm('Delete this task?')) return;
    try {
      const res = await fetch(`${API_BASE}/deletetask/${task.id}`, { method:'DELETE' });
      if (res.ok) fetchTasks();
      else console.error('Delete failed', res.status);
    } catch(e){ console.error(e); }
  }

  // toggle status (PUT)
  async function toggleStatus(task){
    const newStatus = !Boolean(task.status);
    const payload = { id: task.id, name: task.name, status: newStatus };
    try {
      const res = await fetch(`${API_BASE}/updatetask/${task.id}`, {
        method:'PUT',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) fetchTasks(); else console.error('Update failed', res.status);
    } catch(e){ console.error(e); }
  }

  // events
  function bindEvents(){
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      addTask(input.value);
    });
    todoBtn.addEventListener('click', () => { currentFilter='todo'; setActive(todoBtn); renderList(); });
    compBtn.addEventListener('click', () => { currentFilter='completed'; setActive(compBtn); renderList(); });
    allBtn.addEventListener('click', () => { currentFilter='all'; setActive(allBtn); renderList(); });
  }

  // init
  bindEvents();
  setActive(todoBtn);
  fetchTasks();
  input.focus();
})();
