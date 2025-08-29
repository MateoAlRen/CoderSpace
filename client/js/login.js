document.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("user");
  if (user) {
    window.location.href = "../views/feed.html";
    if (user.type === "admin") {
    window.location.href = "../views/admin_post.html"
  }
  } else {
    document.getElementById("appBody").classList.remove("hidden");
  }
});

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
const form = document.getElementById("logIn");
const email = document.getElementById("email");
const password = document.getElementById("password");
let loginStatus = document.getElementById("status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!email.value || !password.value) {
    loginStatus.innerHTML = `<span style="color: rgba(255, 0, 0, 0.555);">Complete all the fields!</span>`;
    return;
  }

  userConfirm(email.value, password.value);
});

// This function will check if the user exists in the database
async function userConfirm(email, password) {
  try {
    const response = await fetch(LOGIN_URL, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    let data = await response.json();
    let validation = data.find(
      (user) => user.user_email === email && user.user_password === password
    );

    if (validation) {
      localStorage.setItem("user", JSON.stringify(validation));
      loginStatus.innerHTML = `<span style="color: rgba(174, 8, 252, 0.56);">Welcome back, ${validation.first_name}!</span>`;
      setTimeout(() => {
        if (validation.type === "admin") {
          window.location.href = "../views/admin_post.html";
        } else {
          window.location.href = "../views/feed.html";
        }
      }, 3000);
    } else {
      loginStatus.innerHTML = `<span style="color: rgba(255, 0, 0, 0.555);">The email or the password are incorrect!</span>`;
    }
  } catch (error) {
    console.error(`Your petition has a problem: ${error}`);
  }
}
