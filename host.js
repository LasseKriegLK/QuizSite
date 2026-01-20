import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getFirestore,
    collection,
    onSnapshot,
    query,
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDuQhrbY3AkVLDTmg6V2c5kCk68sjsnxtc",
    authDomain: "quizsite-d3bf0.firebaseapp.com",
    projectId: "quizsite-d3bf0",
    storageBucket: "quizsite-d3bf0.firebasestorage.app",
    messagingSenderId: "96020739271",
    appId: "1:96020739271:web:7627f540badd610632bae2",
    measurementId: "G-7QX6TQEEY5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const container = document.getElementById('answers');
const state = new Map();

async function addPoint(name) {
    const ref = doc(db, "answers", name);
    const snap = await getDoc(ref);
    const points = snap.exists() ? snap.data().points || 0 : 0;

    await setDoc(ref, {
        points: points + 1
    }, { merge: true });
}

async function removePoint(name) {
    const ref = doc(db, "answers", name);
    const snap = await getDoc(ref);
    const points = snap.exists() ? snap.data().points || 0 : 0;

    await setDoc(ref, {
        points: points - 1
    }, { merge: true });
}

function render(docSnap) {
    const data = docSnap.data();
    const name = data.name;
    const answer = data.answer;
    const points = data.points || 0;
    const status = data.status;

    if (!state.has(name)) {
        const el = document.createElement('div');
        el.className = 'answer-item';

        const title = document.createElement('strong');
        title.textContent = name;

        const answerEl = document.createElement('span');
        answerEl.className = 'answer';
        answerEl.textContent = `: ${answer} (Points: `;

        const pointsEl = document.createElement('span');
        pointsEl.className = 'points';
        pointsEl.textContent = points;

        const close = document.createElement('span');
        close.textContent = ') ';

        const plus = document.createElement('button');
        plus.textContent = '+1';
        plus.onclick = () => addPoint(name);

        const minus = document.createElement('button');
        minus.textContent = '-1';
        minus.onclick = () => removePoint(name);

        const statusEl = document.createElement('span');
        statusEl.className = 'status ' + status;
        statusEl.textContent = ` [${status}]`;

        el.append(title, answerEl, pointsEl, close, plus, minus, statusEl);

        state.set(name, { el, pointsEl, answerEl, statusEl });
    } else {
        const item = state.get(name);
        item.statusEl.className = 'status ' + status;
        item.statusEl.textContent = ` [${status}]`;
        item.pointsEl.textContent = points;
        item.answerEl.textContent = `: ${answer} (Points: `;
    }
}


const q = query(
    collection(db, "answers")
);

const quizSelect = document.getElementById("quizSelect");
const categorySelect = document.getElementById("categorySelect");
const questionSelect = document.getElementById("questionSelect");

async function loadQuizzes() {
    const snapshot = await get(ref(db, "Quizzes"));
    if (!snapshot.exists()) return;

    quizSelect.innerHTML = `<option value="">Select Quiz</option>`;

    Object.keys(snapshot.val()).forEach(quizId => {
        const option = document.createElement("option");
        option.value = quizId;
        option.textContent = quizId;
        quizSelect.appendChild(option);
    });
}

loadQuizzes();

quizSelect.addEventListener("change", async () => {
    const quizId = quizSelect.value;

    categorySelect.innerHTML = `<option value="">Select Category</option>`;
    questionSelect.innerHTML = `<option value="">Select Question</option>`;
    categorySelect.disabled = true;
    questionSelect.disabled = true;

    if (!quizId) return;

    const snapshot = await get(ref(db, `Quizzes/${quizId}`));
    if (!snapshot.exists()) return;

    Object.keys(snapshot.val()).forEach(categoryId => {
        const option = document.createElement("option");
        option.value = categoryId;
        option.textContent = categoryId;
        categorySelect.appendChild(option);
    });

    categorySelect.disabled = false;
});

categorySelect.addEventListener("change", async () => {
    const quizId = quizSelect.value;
    const categoryId = categorySelect.value;

    questionSelect.innerHTML = `<option value="">Select Question</option>`;
    questionSelect.disabled = true;

    if (!quizId || !categoryId) return;

    const snapshot = await get(
        ref(db, `Quizzes/${quizId}/${categoryId}`)
    );

    if (!snapshot.exists()) return;

    Object.entries(snapshot.val()).forEach(([questionKey, questionData]) => {
        const option = document.createElement("option");
        option.value = questionKey;
        option.textContent = questionData.questionText;
        questionSelect.appendChild(option);
    });

    questionSelect.disabled = false;
});

onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach(change => {
        if (change.type === "added" || change.type === "modified") {
            render(change.doc);
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const hideButton = document.getElementById("hide Question");

    hideButton.addEventListener("click", async () => {
        await setDoc(doc(db, "quizState", "current"), {
            questionID: none,
            updated_at: serverTimestamp()
        }, { merge: true });
    }
    );
});