const API_URL = "http://localhost:3000/users";
const user = JSON.parse(localStorage.getItem("user"));
const USER_ID = user ? user.user_id : null;
const form = document.querySelector("form");
const cancelBtn = document.getElementById("cancelBtn");
const notificationContainer = document.getElementById("notificationContainer");


function showNotification(message, type) {
  const notification = document.createElement('div');
  const baseClasses = "p-4 rounded-lg text-white font-bold opacity-90 transition-opacity duration-500 shadow-lg";
  const successClasses = "bg-green-500";
  const errorClasses = "bg-red-500";
  
  notification.className = `${baseClasses} ${type === 'success' ? successClasses : errorClasses}`;
  notification.textContent = message;
  notificationContainer.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}


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
    showNotification("❌ No se pudo cargar la información del usuario", "error")
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

    if (!response.ok) {
      if (res.status === 400) {
        showNotification("❌ The data is not appropiate...", "error");
      } else {
        showNotification("❌ There's a problem with the server", "error");
      }
    } else {
      showNotification("✅ Profile updated succesfully", "success");
      getUserData(userData.user_email);
      console.log("User updated");
    }

    // Convertir la respuesta a JSON para obtener los datos actualizados
    const updatedUser = await response.json();
    
    // Actualizar el localStorage con los nuevos datos del usuario.
    localStorage.setItem("user", JSON.stringify(userData));


  } catch (error) {
    console.error(error);
    showNotification("❌ There's a problem with the server", "error");
  }
});


cancelBtn.addEventListener("click", () => {
  window.location.href = "../views/profile.html"; 
});

async function getUserData(email) {
  try {
    const response = await fetch("http://localhost:3000/users", {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    let data = await response.json();
    let validation = data.find(user => user.user_email === email);
    if (validation) {
      localStorage.setItem("user", JSON.stringify(validation));
      window.location.href = "../views/profile.html";
    } 
} catch (error) {
    console.error(`Your petition has a problem: ${error}`);
  }
}