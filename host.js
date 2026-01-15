import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getFirestore,
    collection,
    onSnapshot,
    query,
    orderBy
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

function render(doc) {
    const data = doc.data();
    const name = data.name;
    const answer = data.answer;

    if (!state.has(name)) {
        const el = document.createElement('div');
        el.className = 'answer-item new';
        el.innerHTML = `<strong>${name}</strong>: ${answer}`;
        container.appendChild(el);
        state.set(name, el);
        setTimeout(() => el.classList.remove('new'), 300);
    } else {
        const el = state.get(name);
        el.innerHTML = `<strong>${name}</strong>: ${answer}`;
        el.classList.add('changed');
        setTimeout(() => el.classList.remove('changed'), 800);
    }
}

const q = query(collection(db, "answers"), orderBy("updated_at"));

onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach(change => {
        if (change.type === "added" || change.type === "modified") {
            render(change.doc);
        }
    });
});
