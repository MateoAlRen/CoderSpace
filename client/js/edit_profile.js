const API_URL = "http://localhost:3000/users";
const USER_ID = localStorage.getItem("userId");
const form = document.querySelector("form");
const cancelBtn = document.getElementById("cancelBtn");


async function loadUserData() {
  try {
    const res = await fetch(`${API_URL}/${USER_ID}`);
    if (!res.ok) throw new Error("Error al obtener usuario");

    const data = await res.json();
    const user = data[0];
    
    document.getElementById("firstName").value = user.first_name || "";
    document.getElementById("secondName").value = user.second_name || "";
    document.getElementById("lastName1").value = user.first_lastname || "";
    document.getElementById("lastName2").value = user.second_lastname || "";
    document.getElementById("alias").value = user.user_alias || "";
    document.getElementById("email").value = user.user_email || "";
    document.getElementById("password").value = user.user_password || "";
    document.getElementById("avatar").value = user.user_photo || "";
    document.getElementById("github").value = user.user_github || "";
    document.getElementById("linkedin").value = user.user_linkedin || "";
    document.getElementById("description").value = user.user_description || "";
  } catch (err) {
    console.error(err);
    alert("❌ No se pudo cargar la información del usuario");
  }
}

loadUserData();


form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const userData = {
    first_name: document.getElementById("firstName").value || "",
    second_name: document.getElementById("secondName").value || "",
    first_lastname: document.getElementById("lastName1").value || "",
    second_lastname: document.getElementById("lastName2").value || "",
    user_email: document.getElementById("email").value || "",
    user_password: document.getElementById("password").value || "",
    user_photo: document.getElementById("avatar").value || "",
    user_github: document.getElementById("github").value || "",
    user_linkedin: document.getElementById("linkedin").value || "",
    user_description: document.getElementById("description").value || "",
    user_alias: document.getElementById("alias").value || ""
  };

  try {
    const response = await fetch(`${API_URL}/${USER_ID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) throw new Error("Error al actualizar");

    const updatedUser = await response.json();
    alert("✅ Perfil actualizado correctamente");
    console.log("Usuario actualizado:", updatedUser);
  } catch (error) {
    console.error(error);
    alert("❌ No se pudo guardar el perfil");
  }
});


cancelBtn.addEventListener("click", () => {
  window.location.href = "../views/profile.html"; 
});