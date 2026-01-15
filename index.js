const form = document.getElementById('quizForm');
const nameEl = document.getElementById('username');
const answerEl = document.getElementById('answer');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = nameEl.value.trim();
    const answer = answerEl.value.trim();
    if (!name) return alert('Enter a name');

    const answers = JSON.parse(localStorage.getItem('answers') || '{}');

    answers[name] = {
        answer,
        updated_at: Date.now()
    };

    localStorage.setItem('answers', JSON.stringify(answers));
    answerEl.value = '';
});