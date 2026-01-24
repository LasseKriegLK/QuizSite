import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getFirestore,
    onSnapshot,
    getDoc,
    doc
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

const ref = doc(db, "quizState", "current");

onSnapshot(ref, async (docSnap) => {
    try {
        const data = docSnap.data();
        if (!data) return;

        const questionId = data.questionId;
        const categoryName = data.category;
        if (questionId === "none") {
            document.getElementById("12oder16Screen").classList.add("hidden");
            document.getElementById("BaseScreen").classList.remove("hidden");
            document.getElementById("QuestionScreen").classList.add("hidden");
            document.getElementById("AnswerScreen").classList.add("hidden");
            document.getElementById("ScoreScreen").classList.add("hidden");
            document.getElementById("MultipleChoice").classList.add("hidden");
            document.getElementById("CategoryScreen").classList.add("hidden");
            return;
        }

        if (questionId === "category") {
            document.getElementById("CategoryText").innerText = categoryName;
            document.getElementById("12oder16Screen").classList.add("hidden");
            document.getElementById("BaseScreen").classList.add("hidden");
            document.getElementById("QuestionScreen").classList.add("hidden");
            document.getElementById("AnswerScreen").classList.add("hidden");
            document.getElementById("ScoreScreen").classList.add("hidden");
            document.getElementById("MultipleChoice").classList.add("hidden");
            document.getElementById("CategoryScreen").classList.remove("hidden");
            return;
        }

        if (questionId === "score") {
            const data = docSnap.data();
            const name = data.name;
            const points = data.points || 0;
            if (!state.has(name)) {
                const el = document.createElement('div');
                el.className = 'answer-item';

                const title = document.createElement('strong');
                title.textContent = name;

                const answerEl = document.createElement('span');
                answerEl.className = 'answer';
                answerEl.textContent = `(Punkte: `;

                const pointsEl = document.createElement('span');
                pointsEl.className = 'points';
                pointsEl.textContent = points;

                const close = document.createElement('span');
                close.textContent = ') ';

                el.append(title, answerEl, pointsEl, close);

                state.set(name, { el, pointsEl, answerEl });

            } else {
                const item = state.get(name);
                item.pointsEl.textContent = points;
                item.answerEl.textContent = `: (Points: `;
            }

            document.getElementById("12oder16Screen").classList.add("hidden");
            document.getElementById("BaseScreen").classList.add("hidden");
            document.getElementById("QuestionScreen").classList.add("hidden");
            document.getElementById("AnswerScreen").classList.add("hidden");
            document.getElementById("MultipleChoice").classList.add("hidden");
            document.getElementById("CategoryScreen").classList.add("hidden");
            document.getElementById("ScoreScreen").classList.remove("hidden");
            return;
        }

        const questionDocSnap = await getDoc(doc(db, "questions", questionId));
        if (!questionDocSnap.exists()) return;

        const questionData = questionDocSnap.data();
        const questionText = questionData.question;
        const answerText = questionData.answer;
        const categoryType = questionData.categoryType;

        if (categoryType === "basic") {
            const questionEl = document.getElementById("QuestionText");
            if (questionEl) questionEl.innerText = questionText;
            document.getElementById("12oder16Screen").classList.add("hidden");
            document.getElementById("BaseScreen").classList.add("hidden");
            document.getElementById("QuestionScreen").classList.remove("hidden");
            document.getElementById("AnswerScreen").classList.add("hidden");
            document.getElementById("ScoreScreen").classList.add("hidden");
            document.getElementById("MultipleChoice").classList.add("hidden");
            document.getElementById("CategoryScreen").classList.add("hidden");
            if (data.showAnswer) {
                const answerEl = document.getElementById("AnswerText");
                if (answerEl) answerEl.innerText = answerText;
                document.getElementById("AnswerScreen").classList.remove("hidden");
            }
            return;
        }
        if (categoryType === "multipleChoice") {
            const choice1 = questionData.choice1;
            const choice2 = questionData.choice2;
            const choice3 = questionData.choice3;
            const choice4 = questionData.choice4;
            document.getElementById("mcchoice1Text").innerText = choice1;
            document.getElementById("mcchoice2Text").innerText = choice2;
            document.getElementById("mcchoice3Text").innerText = choice3;
            document.getElementById("mcchoice4Text").innerText = choice4;

            const questionEl = document.getElementById("QuestionText");
            if (questionEl) questionEl.innerText = questionText;
            document.getElementById("12oder16Screen").classList.add("hidden");
            document.getElementById("BaseScreen").classList.add("hidden");
            document.getElementById("QuestionScreen").classList.remove("hidden");
            document.getElementById("AnswerScreen").classList.add("hidden");
            document.getElementById("ScoreScreen").classList.add("hidden");
            document.getElementById("MultipleChoice").classList.remove("hidden");
            document.getElementById("CategoryScreen").classList.add("hidden");
            if (data.showAnswer) {
                const answerEl = document.getElementById("AnswerText");
                if (answerEl) answerEl.innerText = answerText;
                document.getElementById("AnswerScreen").classList.remove("hidden");
            }
            return;
        }
        if (categoryType === "12oder16") {
            const choice1 = questionData.choice1;
            const choice2 = questionData.choice2;
            const choice3 = questionData.choice3;
            const choice4 = questionData.choice4;
            const choice5 = questionData.choice5;
            const choice6 = questionData.choice6;
            const choice7 = questionData.choice7;
            const choice8 = questionData.choice8;
            const choice9 = questionData.choice9;
            const choice10 = questionData.choice10;
            const choice11 = questionData.choice11;
            const choice12 = questionData.choice12;
            const choice13 = questionData.choice13;
            const choice14 = questionData.choice14;
            const choice15 = questionData.choice15;
            const choice16 = questionData.choice16;

            choice1 = document.getElementById("choice1Text").innerText;
            choice2 = document.getElementById("choice2Text").innerText;
            choice3 = document.getElementById("choice3Text").innerText;
            choice4 = document.getElementById("choice4Text").innerText;
            choice5 = document.getElementById("choice5Text").innerText;
            choice6 = document.getElementById("choice6Text").innerText;
            choice7 = document.getElementById("choice7Text").innerText;
            choice8 = document.getElementById("choice8Text").innerText;
            choice9 = document.getElementById("choice9Text").innerText;
            choice10 = document.getElementById("choice10Text").innerText;
            choice11 = document.getElementById("choice11Text").innerText;
            choice12 = document.getElementById("choice12Text").innerText;
            choice13 = document.getElementById("choice13Text").innerText;
            choice14 = document.getElementById("choice14Text").innerText;
            choice15 = document.getElementById("choice15Text").innerText;
            choice16 = document.getElementById("choice16Text").innerText;

            const questionEl = document.getElementById("QuestionText");
            if (questionEl) questionEl.innerText = questionText;
            document.getElementById("BaseScreen").classList.add("hidden");
            document.getElementById("QuestionScreen").classList.remove("hidden");
            document.getElementById("AnswerScreen").classList.add("hidden");
            document.getElementById("ScoreScreen").classList.add("hidden");
            document.getElementById("MultipleChoice").classList.add("hidden");
            document.getElementById("CategoryScreen").classList.add("hidden");
            document.getElementById("12oder16Screen").classList.remove("hidden");
            if (data.showAnswer) {
                const answerEl = document.getElementById("AnswerText");
                if (answerEl) answerEl.innerText = answerText;
                document.getElementById("AnswerScreen").classList.remove("hidden");
            }
            return;
        }

    } catch (err) {
        console.error("Error in onSnapshot:", err);
    }
});
