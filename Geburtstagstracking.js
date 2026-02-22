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
const alleGetraenke = [
    "Oberdorfer Helles",
    "Radeberger Pilsner",
    "Corona",
    "San Miguel",
    "Salitos",
    "Espresso Martini",
    "Pornstar Martini",
    "Wein",
    "Spritz",
    "Hugo",
    "Lillet",
    "Mojito",
    "Flavoured Mojito",
    "Whiskey Sour",
    "Pisco Sour",
    "Aperol Sour",
    "Bulldog",
    "Margarita",
    "Frozen Margarita",
    "Tequila Sunrise",
    "Paloma",
    "Pink Dragon Agave",
    "Pina Colada",
    "Swimming Pool",
    "Strawberry Colada",
    "Ed von Schleck",
    "Touch Down",
    "Sex on the Beach",
    "Mule",
    "Red Gin Melon",
    "Cuba Libre",
    "Dark & Stormy",
    "Mai Tai",
    "Zombie"
];

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
        if (trunkInput.value.trim() === "Corona" || trunkInput.value.trim() === "Oberdorfer Helles" || trunkInput.value.trim() === "Radeberger Pilsner" || trunkInput.value.trim() === "San Miguel" || trunkInput.value.trim() === "Salitos") {
            await addDoc(getraenkeRef, {
                name: username,
                trunk: trunkInput.value.trim(),
                menge: Number(mengeInput.value.trim()) / 2,
                updated_at: serverTimestamp()
            });
        }
        else {
            await addDoc(getraenkeRef, {
                name: username,
                trunk: trunkInput.value.trim(),
                menge: Number(mengeInput.value.trim()),
                updated_at: serverTimestamp()
            });
        }
        trunkInput.value = "";
        mengeInput.value = "";
    });

    // Gesamtmenge
    onSnapshot(getraenkeRef, (snapshot) => {
        let gesamt = 0;
        snapshot.forEach(doc => {
            gesamt += Number(doc.data().menge) || 0;
        });

        gesamtEl.innerText = (gesamt / 1000).toFixed(2);
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
    const nichtListeEl = document.getElementById("nichtGetrunken");

    onSnapshot(getraenkeRef, (snapshot) => {

        let gesamt = 0;
        const getrunkeneSorten = new Set();

        snapshot.forEach(doc => {
            const data = doc.data();
            gesamt += Number(data.menge) || 0;

            if (data.trunk) {
                getrunkeneSorten.add(data.trunk);
            }
        });

        gesamtEl.innerText = (gesamt / 1000).toFixed(2);

        // ❗ Jetzt Vergleich
        const nochNicht = alleGetraenke.filter(
            drink => !getrunkeneSorten.has(drink)
        );

        nichtListeEl.innerHTML = "";

        nochNicht.forEach(drink => {
            const li = document.createElement("li");
            li.innerText = drink;
            nichtListeEl.appendChild(li);
        });
    });

    const userTablesEl = document.getElementById("userTables");

    onSnapshot(getraenkeRef, (snapshot) => {

        // 1️⃣ Daten nach User gruppieren
        const userData = {};

        snapshot.forEach(doc => {
            const data = doc.data();
            const name = data.name;
            const liter = (Number(data.menge) || 0) / 1000;

            if (!userData[name]) {
                userData[name] = {
                    drinks: {},
                    total: 0
                };
            }

            // Getränk summieren
            if (!userData[name].drinks[data.trunk]) {
                userData[name].drinks[data.trunk] = 0;
            }

            userData[name].drinks[data.trunk] += liter;
            userData[name].total += liter;
        });

        // 2️⃣ Anzeige neu aufbauen
        userTablesEl.innerHTML = "";
        const sortedUsers = Object.entries(userData)
            .sort((a, b) =>
                a[0].toLowerCase().localeCompare(b[0].toLowerCase())
            );

        sortedUsers.forEach(name => {

            const userBlock = document.createElement("div");
            userBlock.style.marginBottom = "30px";

            const title = document.createElement("h3");
            title.innerText = name;
            userBlock.appendChild(title);

            const table = document.createElement("table");
            table.border = "1";
            table.style.borderCollapse = "collapse";
            table.style.marginBottom = "10px";

            const headerRow = document.createElement("tr");
            headerRow.innerHTML = `
            <th>Getränk</th>
            <th>Liter</th>
        `;
            table.appendChild(headerRow);

            Object.entries(userData[name].drinks).forEach(([drink, liter]) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                <td>${drink}</td>
                <td>${liter.toFixed(2)}</td>
            `;
                table.appendChild(row);
            });

            userBlock.appendChild(table);

            const totalText = document.createElement("strong");
            totalText.innerText =
                `Gesamt: ${userData[name].total.toFixed(2)} Liter`;

            userBlock.appendChild(totalText);

            userTablesEl.appendChild(userBlock);
        });

    });

});