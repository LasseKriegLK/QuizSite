import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    orderBy,
    limit,
    serverTimestamp,
    onSnapshot
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

const form = document.getElementById('getränkeForm');
const username = sessionStorage.getItem("username");
const getraenkeRef = collection(db, "getränke");
console.log("Logged in as:", username);

document.addEventListener("DOMContentLoaded", () => {

    if (!username) {
        window.location.href = "/QuizSite/login.html";
    } else {
        document.getElementById("userDisplay").innerText =
            `Willkommen, ${username}!`;
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logoutButton");

    logoutButton.addEventListener("click", () => {
        sessionStorage.removeItem("username");
        window.location.href = "/QuizSite/login.html";
    });
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const trunk = document.getElementById("trunk").value.trim();
    const menge = document.getElementById("menge").value.trim();

    await addDoc(collection(db, "getränke"), {
        name: username,
        trunk: trunk,
        menge: menge,
        updated_at: serverTimestamp()
    }, { merge: true });

    trunk.value = "";
    menge.value = "";
});

const gesamtEl = document.getElementById("gesamtMenge");
const listeEl = document.getElementById("letzteEintraege");

onSnapshot(getraenkeRef, (snapshot) => {
    let gesamt = 0;

    snapshot.forEach(doc => {
        const data = doc.data();
        gesamt += Number(data.menge) || 0;
    });

    gesamtEl.innerText = gesamt;
});

// Letzte 3 Einträge nach Zeit sortiert
const letzteQuery = query(
    getraenkeRef,
    orderBy("updated_at", "desc"),
    limit(3)
);

onSnapshot(letzteQuery, (snapshot) => {
    listeEl.innerHTML = "";

    snapshot.forEach(doc => {
        const data = doc.data();
        const li = document.createElement("li");
        li.innerText = `${data.name}: ${data.trunk} (${data.menge} ml)`;
        listeEl.appendChild(li);
    });
});