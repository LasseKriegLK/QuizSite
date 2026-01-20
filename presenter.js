import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getFirestore,
    onSnapshot,
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

const ref1 = doc(db, "quizState", "current");
const ref2 = doc(db, "questions");

onSnapshot(ref1, async (docSnap) => {
    const data = docSnap.data();
    const questionId = data.questionId;

    if (questionId === "none") {
        document.getElementById("BaseScreen").classList.remove("hidden");
        document.getElementById("QuestionScreen").classList.add("hidden");
        document.getElementById("AnswerScreen").classList.add("hidden");
        document.getElementById("ScoreScreen").classList.add("hidden");
        document.getElementById("MultipleChoice").classList.add("hidden");
        return;
    }




});