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

const quizForm = document.getElementById("quizCreatorForm");
const categoryForm = document.getElementById("categoryForm");
const questionForm = document.getElementById("questionForm");

document.addEventListener("DOMContentLoaded", () => {
    categoryForm.style.display = "none";
    questionForm.style.display = "none";
});

quizForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const quizName = document.getElementById("quizName").value.trim();

    if (!quizName) {
        alert("Bitte Quiznamen eingeben");
        return;
    }
    categoryForm.style.display = "block";
});

categoryForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const categoryName = document.getElementById("categoryName").value.trim();

    if (!categoryName) {
        alert("Bitte Kategorienamen eingeben");
        return;
    }
    questionForm.style.display = "block";
});

questionForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const quizName = document.getElementById("quizName").value.trim();
    const categoryName = document.getElementById("categoryName").value.trim();
    const questionText = document.getElementById("questionText").value.trim();
    const answerText = document.getElementById("answerText").value.trim();
    const questionKey = serverTimestamp();

    if (!questionText || !answerText) {
        alert("Bitte Frage und Antwort eingeben");
        return;
    }
    await setDoc(doc(db, "questions", questionKey), {
        quiz: quizName,
        category: categoryName,
        question: questionText,
        answer: answerText,
        created_at: serverTimestamp()
    });
    await setDoc(doc(db, "Quizzes", quizName), {
        name: quizName
    }, { merge: true });
    await setDoc(doc(db, "Quizzes", quizName, "Categories", categoryName), {
        name: categoryName
    }, { merge: true });
    await setDoc(doc(db, "Quizzes", quizName, "Categories", categoryName, "Questions", questionKey), {
        Key: questionKey,
        question: questionText,
        answer: answerText,
        created_at: serverTimestamp()
    });
    document.getElementById("questionText").value = "";
    document.getElementById("answerText").value = "";
});