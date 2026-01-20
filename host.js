import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getFirestore,
    collection,
    onSnapshot,
    query,
    doc,
    getDoc,
    setDoc,
    serverTimestamp,
    getDocs,
    where
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

async function addPoint(name) {
    const ref = doc(db, "answers", name);
    const snap = await getDoc(ref);
    const points = snap.exists() ? snap.data().points || 0 : 0;

    await setDoc(ref, {
        points: points + 1
    }, { merge: true });
}

async function removePoint(name) {
    const ref = doc(db, "answers", name);
    const snap = await getDoc(ref);
    const points = snap.exists() ? snap.data().points || 0 : 0;

    await setDoc(ref, {
        points: points - 1
    }, { merge: true });
}

function render(docSnap) {
    const data = docSnap.data();
    const name = data.name;
    const answer = data.answer;
    const points = data.points || 0;
    const status = data.status;

    if (!state.has(name)) {
        const el = document.createElement('div');
        el.className = 'answer-item';

        const title = document.createElement('strong');
        title.textContent = name;

        const answerEl = document.createElement('span');
        answerEl.className = 'answer';
        answerEl.textContent = `: ${answer} (Points: `;

        const pointsEl = document.createElement('span');
        pointsEl.className = 'points';
        pointsEl.textContent = points;

        const close = document.createElement('span');
        close.textContent = ') ';

        const plus = document.createElement('button');
        plus.textContent = '+1';
        plus.onclick = () => addPoint(name);

        const minus = document.createElement('button');
        minus.textContent = '-1';
        minus.onclick = () => removePoint(name);

        const statusEl = document.createElement('span');
        statusEl.className = 'status ' + status;
        statusEl.textContent = ` [${status}]`;

        el.append(title, answerEl, pointsEl, close, plus, minus, statusEl);

        state.set(name, { el, pointsEl, answerEl, statusEl });
    } else {
        const item = state.get(name);
        item.statusEl.className = 'status ' + status;
        item.statusEl.textContent = ` [${status}]`;
        item.pointsEl.textContent = points;
        item.answerEl.textContent = `: ${answer} (Points: `;
    }
}


const q = query(
    collection(db, "answers")
);

onSnapshot(q, (querySnapshot) => {
    querySnapshot.forEach((docSnap) => {
        render(docSnap);
    });
    container.innerHTML = '';
    state.forEach(({ el }) => {
        container.appendChild(el);
    });
});

document.getElementById("hide Question").addEventListener("click", async () => {
    await setDoc(doc(db, "quizState", "current"), {
        questionId: "none",
        updated_at: serverTimestamp()
    }, { merge: true });
});

const quizDropdown = document.getElementById("quizDropdown");
const questionsContainer = document.getElementById("questionsContainer");

async function loadQuizzes() {
    const quizzesSnapshot = await getDocs(collection(db, "Quizzes"));
    quizzesSnapshot.forEach(docSnap => {
        const quizId = docSnap.id;
        const option = document.createElement("option");
        option.value = quizId;
        option.textContent = quizId;
        quizDropdown.appendChild(option);
    });
}

loadQuizzes();

quizDropdown.addEventListener("change", async () => {
    const quizId = quizDropdown.value;
    questionsContainer.innerHTML = "";

    if (!quizId) return;

    const quizDocRef = doc(db, "Quizzes", quizId);
    const quizDocSnap = await getDoc(quizDocRef);

    if (!quizDocSnap.exists()) return;

    const quizData = quizDocSnap.data();

    const categoriesSnapshot = await getDocs(collection(db, "Quizzes", quizId, "Categories"));

    for (const categoryDoc of categoriesSnapshot.docs) {
        const categoryName = categoryDoc.id;

        const categoryHeader = document.createElement("h3");
        categoryHeader.textContent = categoryName;
        questionsContainer.appendChild(categoryHeader);

        const questionsSnapshot = await getDocs(collection(db, "Quizzes", quizId, "Categories", categoryName, "Questions"));

        const questionsArray = [];
        questionsSnapshot.forEach(qDoc => {
            const data = qDoc.data();
            questionsArray.push({ ...data, id: qDoc.id });
        });

        questionsArray.sort((a, b) => a.created_at?.seconds - b.created_at?.seconds);

        questionsArray.forEach(q => {
            const button = document.createElement("button");
            button.textContent = q.question;
            button.onclick = () => alert(`Question: ${q.question}\nAnswer: ${q.answer}`);
            questionsContainer.appendChild(button);
        });
    }
});