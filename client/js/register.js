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

const REGISTER_URL = "http://localhost:3000/users";
const form = document.getElementById("registerForm");
const first_name = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password");
const passwordConfirm = document.getElementById("passwordConfirm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userName = first_name.value;
  const userEmail = email.value;
  const userPassword = password.value;
  const userPasswordConfirm = passwordConfirm.value;

  if (!userName || !userEmail || !userPassword || !userPasswordConfirm) {
    alert("Fill in all fields");
    return;
  }

  if (userPasswordConfirm != userPassword) {
    alert("Enter the same password");
    return;
  }

  const newUser = {
    first_name: userName,
    user_email: userEmail,
    user_password: userPassword,
  };

  try {
    const res = await fetch(REGISTER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });
    console.log("Success registering user");
    alert("Success registering user");
  } catch (error) {
    console.log("Error registering user");
    alert("Error registering user");
  }
  form.reset();
});
