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

const form = document.getElementById('quizFormStandard');
const answerEl = document.getElementById('answer');
const username = sessionStorage.getItem("username");

if (!username) {
    window.location.href = "/QuizSite/login/login.html";
} else {
    console.log("Eingeloggt als:", username);

    document.getElementById("userDisplay").innerText =
        `Willkommen, ${username}!`;
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const answer = answerEl.value.trim();

    await setDoc(doc(db, "answers", username), {
        name: username,
        answer,
        updated_at: serverTimestamp()
    }, { merge: true });

    answerEl.value = "";
});


document.addEventListener("visibilitychange", () => {
    const name = sessionStorage.getItem("username");
    if (name) {
        setDoc(doc(db, "answers", name), {
            updated_at: serverTimestamp(),
            status: document.visibilityState === "visible" ? "online" : "offline"
        }, {
            merge: true
        });
    }
});

function logout() {
    sessionStorage.removeItem("username");
    window.location.href = "/QuizSite/login/login.html";
}