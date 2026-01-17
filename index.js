import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getFirestore,
    doc,
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

const form = document.getElementById('quizForm');
const nameEl = document.getElementById('username');
const answerEl = document.getElementById('answer');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = nameEl.value.trim();
    const answer = answerEl.value.trim();
    if (!name) return alert("Enter a name");

    await setDoc(doc(db, "answers", name), {
        name,
        answer,
        updated_at: serverTimestamp()
    });

    answerEl.value = "";
});

window.addEventListener("blur", () => {
    const name = nameEl.value.trim();
    if (name) {
        setDoc(doc(db, "answers", name), {
            name,
            answer: "[left the quiz]",
            updated_at: serverTimestamp()
        });
    }
});
