document.getElementById("year").textContent = new Date().getFullYear();
const toggle = document.getElementById("dark-toggle");
const root = document.documentElement;
if (
  localStorage.theme === "dark" ||
  (!("theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  root.classList.add("dark");
}
toggle.addEventListener("click", () => {
  root.classList.toggle("dark");
  if (root.classList.contains("dark")) {
    localStorage.theme = "dark";
    toggle.textContent = "☀️";
  } else {
    localStorage.theme = "light";
    toggle.textContent = "🌙";
  }
});

toggle.textContent = root.classList.contains("dark") ? "☀️" : "🌙";

const LOGIN_URL = "http://localhost:3000/users";
const form = document.getElementById("formLogin");
const email = document.getElementById("email");
const password = document.getElementById("password");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userEmail = email.value;
  const userPassword = password.value;

  if (!userEmail || !userPassword) {
    alert("Fill in all fields");
    return;
  }

  try {
    const res = await fetch(LOGIN_URL);
    const user = await res.json();

    const validation = user.find(
      (e) => e.user_email == userEmail && e.user_password == userPassword
    );

    if (validation) {
      localStorage.setItem("userId", JSON.stringify(validation));
      alert("Welcome");
    } else {
      alert("Incorrect credentials");
    }
  } catch (error) {
    alert("Server error")
  }
  form.reset();
});
