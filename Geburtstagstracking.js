import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    orderBy,
    limit,
    query,
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
const getraenkeRef = collection(db, "getränke");

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("getränkeForm");
    const logoutButton = document.getElementById("logoutButton");
    const gesamtEl = document.getElementById("gesamtMenge");
    const listeEl = document.getElementById("letzteEintraege");

    const username = sessionStorage.getItem("username");

    if (!username) {
        window.location.href = "/QuizSite/login.html";
        return;
    }

    document.getElementById("userDisplay").innerText =
        `Willkommen, ${username}!`;

    logoutButton.addEventListener("click", () => {
        sessionStorage.removeItem("username");
        window.location.href = "/QuizSite/login.html";
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const trunkInput = document.getElementById("trunk");
        const mengeInput = document.getElementById("menge");

        await addDoc(getraenkeRef, {
            name: username,
            trunk: trunkInput.value.trim(),
            menge: Number(mengeInput.value.trim()),
            updated_at: serverTimestamp()
        });

        trunkInput.value = "";
        mengeInput.value = "";
    });

    // Gesamtmenge
    onSnapshot(getraenkeRef, (snapshot) => {
        let gesamt = 0;
        snapshot.forEach(doc => {
            gesamt += Number(doc.data().menge) || 0;
        });

        gesamtEl.innerText = (gesamt / 1000).toFixed(2) + " Liter";
    });

    // Letzte 3
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

});