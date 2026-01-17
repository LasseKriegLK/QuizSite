import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getFirestore,
    collection,
    onSnapshot,
    query,
    doc,
    getDoc,
    setDoc,
    orderBy,
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
    const id = docSnap.id;  // add this
    const data = docSnap.data();
    const name = data.name;
    const answer = data.answer;
    const points = data.points || 0;
    const status = data.status;

    if (!state.has(id)) {  // use ID instead of name
        const el = document.createElement('div');
        el.className = 'answer-item';

        // create inner elements...
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

        // store in state using ID
        state.set(id, { el, pointsEl, answerEl, statusEl });

        return el;  // return element for appending
    } else {
        // update existing element
        const item = state.get(id);
        item.statusEl.className = 'status ' + status;
        item.statusEl.textContent = ` [${status}]`;
        item.pointsEl.textContent = points;
        item.answerEl.textContent = `: ${answer} (Points: `;

        // animation logic...
        return item.el;  // still return element
    }
}

const q = query(
    collection(db, "answers"), orderBy("updated_at", "asc")
);



onSnapshot(q, (snapshot) => {
    snapshot.docs.forEach(docSnap => {
        const id = docSnap.id;
        const item = state.get(id);

        const el = item?.el || render(docSnap);


        container.appendChild(el);
    });
});




