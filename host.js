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
        container.appendChild(el);

        state.set(name, { el, pointsEl, answerEl, statusEl });
    } else {
        const item = state.get(name);
        item.statusEl.className = 'status ' + status;
        item.statusEl.textContent = ` [${status}]`;
        item.pointsEl.textContent = points;
        item.answerEl.textContent = `: ${answer} (Points: `;
        if (item.answerEl.textContent != `: ${answer} (Points: `) {
            item.el.classList.remove('default');
            item.el.classList.add('new');

            setTimeout(() => {
                item.el.classList.remove('new');
                item.el.classList.add('default');
            }, 1000);
        }
        if (item.statusEl.textContent != ` [${status}]`) {
            item.el.classList.remove('default');
            item.el.classList.add('changed');

            setTimeout(() => {
                item.el.classList.remove('changed');
                item.el.classList.add('default');
            }, 1000);
        }
    }
}

const q = query(
    collection(db, "answers")
);



onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach(change => {
        if (change.type === "added" || change.type === "modified") {
            render(change.doc);
        }
    });
});
