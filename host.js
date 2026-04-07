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
    orderBy,
    getDocs
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

        const lockEl = document.createElement('button');
        lockEl.textContent = 'Lock';
        lockEl.onclick = async () => {
            await setDoc(doc(db, "answers", name), {
                quizState: "locked"
            }, { merge: true });
        }

        const unlockEl = document.createElement('button');
        unlockEl.textContent = 'Unlock';
        unlockEl.onclick = async () => {
            await setDoc(doc(db, "answers", name), {
                quizState: "unlocked"
            }, { merge: true });
        }

        el.append(title, answerEl, pointsEl, close, plus, minus, statusEl, lock, unlock);

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
    collection(db, "answers"),
    orderBy("updated_at", "desc")
);

onSnapshot(q, (querySnapshot) => {
    container.innerHTML = '';
    querySnapshot.forEach((docSnap) => {
        render(docSnap);
    });


    querySnapshot.forEach((docSnap) => {
        const name = docSnap.data().name;
        const item = state.get(name);
        if (item) {
            container.appendChild(item.el);
        }
    });
});

document.getElementById("lock").addEventListener("click", async () => {
    const querySnapshot = await getDocs(collection(db, "answers"));

    const updates = querySnapshot.docs.map((docSnap) =>
        setDoc(doc(db, "answers", docSnap.id), {
            quizState: "locked",
            updated_at: serverTimestamp()
        }, { merge: true })
    );

    await Promise.all(updates);
});

document.getElementById("unlock").addEventListener("click", async () => {
    const querySnapshot = await getDocs(collection(db, "answers"));

    const updates = querySnapshot.docs.map((docSnap) =>
        setDoc(doc(db, "answers", docSnap.id), {
            quizState: "unlocked",
            updated_at: serverTimestamp()
        }, { merge: true })
    );

    await Promise.all(updates);
});


