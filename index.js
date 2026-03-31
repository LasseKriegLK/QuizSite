import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getFirestore,
    doc,
    setDoc,
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

const form = document.getElementById('quizFormStandard');
const answerEl = document.getElementById('answer');
const username = sessionStorage.getItem("username");
setCookie("username", username, 1);
const ref = doc(db, "quizState", "current");
console.log("Logged in as:", username);

document.addEventListener("DOMContentLoaded", () => {
    if (!username && getCookie("username") != null) {
        username = getCookie("username");
        sessionStorage.setItem("username", username);
        console.log("Logged in as:", username);
        document.getElementById("userDisplay").innerText =
            `Willkommen, ${username}!`;
    }
    if (!username && getCookie("username") == null) {
        window.location.href = "/QuizSite/login.html";
    }
    if (username && getCookie("username") == null) {
        setCookie("username", username, 1);
        document.getElementById("userDisplay").innerText =
            `Willkommen, ${username}!`;
    }
});
function setCookie(name, value, daysToLive) {
    const date = new Date();
    date.setTime(date.getTime() + (daysToLive * 24 * 60 * 60 * 1000));
    let expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${value}; ${expires}; path=/`
}

function getCookie(name) {
    const cDecoded = decodeURIComponent(document.cookie);
    const cArray = cDecoded.split("; ");
    let result = null;

    cArray.forEach(element => {
        if (element.indexOf(name) == 0) {
            result = element.substring(name.length + 1)
        }
    })
    return result;
}

onSnapshot(ref, async (docSnap) => {
    try {
        const data = docSnap.data();
        if (!data) return;
        const questionId = data.questionId;

        if (questionId === "none" || questionId === "category" || data.categoryType === "score") {
            document.getElementById('quizFormStandard').style.display = 'none';
        } else {
            document.getElementById('quizFormStandard').style.display = 'block';
        }
    } catch (error) {
        console.error("Error fetching quiz state:", error);
    }
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const answer = answerEl.value.trim();

    await setDoc(doc(db, "answers", username), {
        name: username,
        answer,
        updated_at: serverTimestamp()
    }, { merge: true });

    answerEl.value = "";
    document.getElementById('quizFormStandard').style.display = 'none';
});


document.addEventListener("visibilitychange", () => {
    if (username) {
        setDoc(doc(db, "answers", username), {
            updated_at: serverTimestamp(),
            status: document.visibilityState === "visible" ? "online" : "offline"
        }, {
            merge: true
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logoutButton");

    logoutButton.addEventListener("click", () => {
        sessionStorage.removeItem("username");
        window.location.href = "/QuizSite/login.html";
    });
});