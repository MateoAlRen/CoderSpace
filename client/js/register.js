document.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("user");
  if (user) {
    window.location.href = "../views/feed.html";
    if (user.type === "admin") {
    window.location.href = "../views/admin_post.html";
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

const form = document.getElementById("registerForm");
const first_name = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password");
const passwordConfirm = document.getElementById("passwordConfirm");
let signStatus = document.getElementById("status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userName = first_name.value;
  const userEmail = email.value;
  const userPassword = password.value;
  const userPasswordConfirm = passwordConfirm.value;

  if (!userName || !userEmail || !userPassword || !userPasswordConfirm) {
    signStatus.innerHTML = `<span style="color: rgba(255, 0, 0, 0.555);">Complete all the fields!</span>`;
    return;
  }

  if (userPasswordConfirm != userPassword) {
    signStatus.innerHTML = `<span style="color: rgba(255, 0, 0, 0.555);">The passwords are not the same!</span>`;
    return;
  }

  const newUser = {
    first_name: userName,
    user_email: userEmail,
    user_password: userPassword,
  };

  postUser(newUser)


  form.reset();
});
async function postUser(userData) {
  try {
    const res = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!res.ok) {
      if (res.status === 400) {
        console.error(`Some of your fields break our community rules: ${res.status}`);
        signStatus.innerHTML = `<span style="color: rgba(255, 0, 0, 0.555);">Some of your fields break the community rules...</span>`;
      } else {
        console.error(`There's an error in the server`);
      }
    } else {
      getUsers(userData.user_email);
    }
    
  } catch (error) {
    console.error(`Your petition has a problem: ${error}`);
  }
}

async function getUsers(email) {
  try {
    const response = await fetch("http://localhost:3000/users", {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    let data = await response.json();
    let validation = data.find(user => user.user_email === email);
    if (validation) {
      localStorage.setItem("user", JSON.stringify(validation));
      signStatus.innerHTML = `<span style="color: rgba(88, 56, 233, 1);">Welcome to CoderSpace!</span>`;
      window.location.href = "../views/feed.html";
    } 
} catch (error) {
    console.error(`Your petition has a problem: ${error}`);
  }
}