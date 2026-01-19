import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getFirestore,
    doc,
    setDoc,
    getDoc
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


const loginname = document.getElementById('username').value.trim();
const password = document.getElementById('password').value;
const secondPassword = document.getElementById('confirm_password').value;

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const ref = doc(db, "users", loginname);
    const snap = await getDoc(ref);
    if (snap.exists()) {
        return alert("Benutzername bereits vergeben");
    }

    if (password !== secondPassword) {
        return alert("Passwörter nicht gleich");
    }
    await setDoc(doc(db, "users", loginname), {
        loginname,
        password
    }, { merge: true });
    window.location.href = "/login";
});
