// app.js - connect to your Spring Boot backend
(() => {
  const API_BASE = 'http://127.0.0.1:8080'; // change to your host if needed

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

  // helpers
  const shortId = id => {
    const s = String(id ?? '');
    return s.length > 6 ? s.slice(-6) : s;
  };

  const showLoading = (flag=true) => {
    loadingEl.style.display = flag ? 'block' : 'none';
  };

  const showEmpty = (flag=true) => {
    emptyEl.style.display = flag ? 'block' : 'none';
  };

  function setActive(btn){
    [todoBtn, compBtn, allBtn].forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }

  // fetch tasks
  async function fetchTasks(){
    showLoading(true);
    try {
      const res = await fetch(`${API_BASE}/tasks`);
      const data = await res.json();
      cache = Array.isArray(data) ? data : [];
      renderList();
    } catch(err){
      console.error('fetch error', err);
      listEl.innerHTML = '<li class="task-item"><div class="left"><div class="task-name" style="color:tomato">Unable to contact API</div></div></li>';
    } finally {
      showLoading(false);
    }
  }

  // render filtered list
  function renderList(){
    listEl.innerHTML = '';
    let tasks = cache.slice().reverse(); // show newest first
    if (currentFilter === 'todo') tasks = tasks.filter(t => !Boolean(t.status));
    if (currentFilter === 'completed') tasks = tasks.filter(t => Boolean(t.status));
    if (tasks.length === 0) {
      showEmpty(true);
      return;
    } else showEmpty(false);

    tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = 'task-item';

      const left = document.createElement('div'); left.className = 'left';
      const idSpan = document.createElement('div'); idSpan.className = 'task-id';
      idSpan.textContent = shortId(task.id);
      const nameSpan = document.createElement('div'); nameSpan.className = 'task-name';
      nameSpan.textContent = task.name;
      if (task.status) nameSpan.classList.add('done');

      left.appendChild(idSpan);
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

  // add task (tries server-generated id first; if fails it will retry with client id)
  async function addTask(name){
    if (!name || !name.trim()) return;
    const payloadWithoutId = { name: name.trim(), status: false };
    try {
      let res = await fetch(`${API_BASE}/addtask`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(payloadWithoutId)
      });
      if (!res.ok) {
        // fallback: send with generated id (your backend currently expects id)
        const clientId = Date.now() % 1000000;
        const payloadWithId = { id: clientId, ...payloadWithoutId };
        res = await fetch(`${API_BASE}/addtask`, {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify(payloadWithId)
        });
      }
      if (res.ok) {
        input.value = '';
        await fetchTasks();
        focusInput();
      } else {
        console.error('Add failed', res.status);
      }
    } catch (e) {
      console.error(e);
    }
  }

  // delete
  async function removeTask(task){
    if (!confirm('Delete this task?')) return;
    try {
      const res = await fetch(`${API_BASE}/deletetask/${task.id}`, { method:'DELETE' });
      if (res.ok) fetchTasks();
      else console.error('Delete failed', res.status);
    } catch(e){ console.error(e); }
  }

  // toggle status
  async function toggleStatus(task){
    const newStatus = !Boolean(task.status);
    const payload = { id: task.id, name: task.name, status: newStatus };
    try {
      const res = await fetch(`${API_BASE}/updatetask/${task.id}`, {
        method:'PUT',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) fetchTasks();
      else console.error('Update failed', res.status);
    } catch(e){ console.error(e); }
  }

  // helpers
  function focusInput(){ input.focus(); }
  function bindEvents(){
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      addTask(input.value);
    });
    todoBtn.addEventListener('click', () => { currentFilter='todo'; setActive(todoBtn); renderList(); });
    compBtn.addEventListener('click', () => { currentFilter='completed'; setActive(compBtn); renderList(); });
    allBtn.addEventListener('click', () => { currentFilter='all'; setActive(allBtn); renderList(); });
  }

  // initial
  bindEvents();
  setActive(todoBtn);
  fetchTasks();
  focusInput();
})();
