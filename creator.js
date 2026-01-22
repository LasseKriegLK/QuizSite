import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getFirestore,
    doc,
    setDoc,
    serverTimestamp,
    collection
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

document.addEventListener("DOMContentLoaded", () => {
    const quizForm = document.getElementById("quizCreateForm");
    if (!quizForm) {
        console.error("quizCreateForm not found");
        return;
    }

    quizForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const quizName = document.getElementById("quizTitle").value.trim();
        const categoryName = document.getElementById("categoryName").value.trim();
        const questionText = document.getElementById("questionText").value.trim();
        const answerText = document.getElementById("questionAnswer").value.trim();
        const categoryType = document.getElementById("categoryType").value;
        const questionRef = doc(collection(db, "questions"));
        const questionKey = questionRef.id;

        if (!questionText || !answerText) {
            alert("Bitte Frage und Antwort eingeben");
            return;
        }
        await setDoc(questionRef, {
            quiz: quizName,
            category: categoryName,
            question: questionText,
            answer: answerText,
            categoryType: categoryType,
            created_at: serverTimestamp()
        }, { merge: true });
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
        }, { merge: true });
        document.getElementById("questionText").value = "";
        document.getElementById("questionAnswer").value = "";
        if (categoryType === "multipleChoice") {
            const choice1 = document.getElementById("choice1").value.trim();
            const choice2 = document.getElementById("choice2").value.trim();
            const choice3 = document.getElementById("choice3").value.trim();
            const choice4 = document.getElementById("choice4").value.trim();
            await setDoc(questionRef, {
                choice1: choice1,
                choice2: choice2,
                choice3: choice3,
                choice4: choice4
            }, { merge: true });
            await setDoc(doc(db, "Quizzes", quizName, "Categories", categoryName, "Questions", questionKey), {
                choice1: choice1,
                choice2: choice2,
                choice3: choice3,
                choice4: choice4
            }, { merge: true });
            document.getElementById("choice1").value = "";
            document.getElementById("choice2").value = "";
            document.getElementById("choice3").value = "";
            document.getElementById("choice4").value = "";
        }
    if (categoryType === "12oder16") {
            const choice1 = document.getElementById("choice1").value.trim();
            const choice2 = document.getElementById("choice2").value.trim();
            const choice3 = document.getElementById("choice3").value.trim();
            const choice4 = document.getElementById("choice4").value.trim();
            const choice5 = document.getElementById("choice5").value.trim();
            const choice6 = document.getElementById("choice6").value.trim();
            const choice7 = document.getElementById("choice7").value.trim();
            const choice8 = document.getElementById("choice8").value.trim();
            const choice9 = document.getElementById("choice9").value.trim();
            const choice10 = document.getElementById("choice10").value.trim();
            const choice11 = document.getElementById("choice11").value.trim();
            const choice12 = document.getElementById("choice12").value.trim();
            const choice13 = document.getElementById("choice13").value.trim();
            const choice14 = document.getElementById("choice14").value.trim();
            const choice15 = document.getElementById("choice15").value.trim();
            const choice16 = document.getElementById("choice16").value.trim();
            await setDoc(questionRef, {
                choice1: choice1,
                choice2: choice2,
                choice3: choice3,
                choice4: choice4,
                choice5: choice5,
                choice6: choice6,
                choice7: choice7,
                choice8: choice8,
                choice9: choice9,
                choice10: choice10,
                choice11: choice11,
                choice12: choice12,
                choice13: choice13,
                choice14: choice14,
                choice15: choice15,
                choice16: choice16
            }, { merge: true });
            await setDoc(doc(db, "Quizzes", quizName, "Categories", categoryName, "Questions", questionKey), {
                choice1: choice1,
                choice2: choice2,
                choice3: choice3,
                choice4: choice4,
                choice5: choice5,
                choice6: choice6,
                choice7: choice7,
                choice8: choice8,
                choice9: choice9,
                choice10: choice10,
                choice11: choice11,
                choice12: choice12,
                choice13: choice13,
                choice14: choice14,
                choice15: choice15,
                choice16: choice16
            }, { merge: true });
            document.getElementById("choice1").value = "";
            document.getElementById("choice2").value = "";
            document.getElementById("choice3").value = "";
            document.getElementById("choice4").value = "";
            document.getElementById("choice5").value = "";
            document.getElementById("choice6").value = "";
            document.getElementById("choice7").value = "";
            document.getElementById("choice8").value = "";
            document.getElementById("choice9").value = "";
            document.getElementById("choice10").value = "";
            document.getElementById("choice11").value = "";
            document.getElementById("choice12").value = "";
            document.getElementById("choice13").value = "";
            document.getElementById("choice14").value = "";
            document.getElementById("choice15").value = "";
            document.getElementById("choice16").value = "";
        }
    });
});
