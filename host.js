const POLL_MS = 1000;
const container = document.getElementById('answers');
const state = new Map(); // name -> { answer, updated_at, el }

function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

function createItem(name, answer, updated_at, isNew = false) {
    const el = document.createElement('div');
    el.className = 'answer-item' + (isNew ? ' new' : '');
    el.dataset.name = name;

    const badge = document.createElement('div');
    badge.className = 'user-badge';
    badge.textContent = (name || '').slice(0,2).toUpperCase();

    const content = document.createElement('div');
    content.className = 'answer-content';
    content.innerHTML = `<div class="answer-name">${escapeHtml(name)}</div>
                         <div class="answer-text">${escapeHtml(answer)}</div>`;

    const time = document.createElement('div');
    time.className = 'answer-time';
    time.textContent = new Date(updated_at).toLocaleTimeString();

    el.appendChild(badge);
    el.appendChild(content);
    el.appendChild(time);

    return el;
}

function updateItem(el, name, answer, updated_at) {
    const content = el.querySelector('.answer-content');
    const time = el.querySelector('.answer-time');
    if (content) content.innerHTML = `<div class="answer-name">${escapeHtml(name)}</div>
                                      <div class="answer-text">${escapeHtml(answer)}</div>`;
    if (time) time.textContent = new Date(updated_at).toLocaleTimeString();
}

function render(rows) {
    const seen = new Set();

    // sort by name for stable order (or by updated_at if you prefer)
    rows.sort((a,b) => a.name.localeCompare(b.name, undefined, {sensitivity:'base'}));

    for (const r of rows) {
        const name = String(r.name || '');
        const answer = String(r.answer || '');
        const updated_at = r.updated_at || Date.now();
        seen.add(name);

        const record = state.get(name);
        if (!record) {
            // new entry
            const el = createItem(name, answer, updated_at, true);
            container.appendChild(el);
            state.set(name, { answer, updated_at, el });
            // remove the 'new' animation class after it finishes
            setTimeout(() => el.classList.remove('new'), 350);
            continue;
        }

        // existing entry: check if answer changed
        if (record.answer !== answer) {
            updateItem(record.el, name, answer, updated_at);
            // add 'changed' class to flash red, then remove after animation
            record.el.classList.add('changed');
            setTimeout(() => record.el.classList.remove('changed'), 1200);
            record.answer = answer;
            record.updated_at = updated_at;
        } else if (record.updated_at !== updated_at) {
            // update time only if timestamp changed
            updateItem(record.el, name, answer, updated_at);
            record.updated_at = updated_at;
        }
    }

    // remove entries that are no longer present
    for (const [name, rec] of Array.from(state.entries())) {
        if (!seen.has(name)) {
            rec.el.remove();
            state.delete(name);
        }
    }
}

async function fetchAnswers() {
    try {
        const res = await fetch('/answers');
        if (!res.ok) return;
        const rows = await res.json();
        render(rows);
    } catch (e) { /* ignore transient errors */ }
}

fetchAnswers();
setInterval(fetchAnswers, POLL_MS);