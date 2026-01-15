const POLL_MS = 1000;
const container = document.getElementById('answers');
const state = new Map();

function render() {
    const data = JSON.parse(localStorage.getItem('answers') || '{}');

    Object.entries(data).forEach(([name, obj]) => {
        const existing = state.get(name);

        if (!existing) {
            const el = document.createElement('div');
            el.className = 'answer-item new';
            el.innerHTML = `<strong>${name}</strong>: ${obj.answer}`;
            container.appendChild(el);
            state.set(name, { el, answer: obj.answer });
            setTimeout(() => el.classList.remove('new'), 300);
            return;
        }

        if (existing.answer !== obj.answer) {
            existing.el.innerHTML = `<strong>${name}</strong>: ${obj.answer}`;
            existing.el.classList.add('changed');
            setTimeout(() => existing.el.classList.remove('changed'), 800);
            existing.answer = obj.answer;
        }
    });
}

render();
setInterval(render, POLL_MS);
