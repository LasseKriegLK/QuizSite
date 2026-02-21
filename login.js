const form = document.getElementById("loginForm");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();

    if (!username) {
        alert("Bitte Namen eingeben");
        return;
    }

    sessionStorage.setItem("username", username);
    window.location.href = "/QuizSite/Geburtstagstracking.html";
});