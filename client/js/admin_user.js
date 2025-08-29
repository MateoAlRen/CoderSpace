document.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("user");
  if (!user) {
    window.location.href = "../views/login.html";
  } else if (user.type === "user") {
    window.location.href = "../views/feed.html";
  } else {
    document.getElementById("appBody").classList.remove("hidden");
  }
});

let logOut = document.getElementById("logoutBtn");
logOut.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("user");
    window.location.href = "../index.html";
});


// ========== DARK MODE ==========
const darkToggle = document.getElementById("darkToggle");
const root = document.documentElement;

darkToggle.addEventListener("click", () => {
  root.classList.toggle("dark");
  if (root.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    darkToggle.textContent = "☀";
  } else {
    localStorage.setItem("theme", "light");
    darkToggle.textContent = "🌙";
  }
});
darkToggle.textContent = root.classList.contains("dark") ? "☀" : "🌙";

// ========== VARIABLES ==========
const tbody = document.getElementById("tbody");
const ADMIN_USER_URL = "http://localhost:3000/users/post_user";
const USER_URL = "http://localhost:3000/users";
let users = []; // array global

// ========== RENDER TABLE ==========
function renderTable(data) {
  tbody.innerHTML = ``;

  if (data.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-4 text-gray-500 dark:text-gray-400">
          No se encontraron resultados
        </td>
      </tr>
    `;
    return;
  }

  data.forEach((element) => {
    tbody.innerHTML += `
        <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
          <td class="px-6 py-4">
            <div class="flex items-center gap-3">
              <span class="font-medium">${element.user_id}</span>
            </div>
          </td>
          <td class="px-6 py-4">
            <div class="flex items-center gap-3">
              <span class="font-medium">${element.first_name}</span>
            </div>
          </td>
          <td class="px-6 py-4">
            <div>
              <p class="font-medium">${element.first_lastname}</p>
            </div>
          </td>
          <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
            ${new Date(element.created_at).toLocaleString()}
          </td>
          <td class="px-6 py-4">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
              ${element.post} Post
            </span>
          </td>

          <td class="px-6 py-4 text-right">
            <div class="flex items-center justify-end gap-2">
              <button
                class="p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950 text-indigo-600 dark:text-indigo-400 transition-colors"
                title="Edit"
                onclick="Update('${element.user_id}')"
              >
                <svg
                  class="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>

              <button
                class="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-red-600 dark:text-red-400 transition-colors"
                title="Delete"
                onclick="Delete('${element.user_id}')"
              >
                <svg
                  class="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </td>
        </tr>
      `;
  });
}

// ========== FETCH USERS ==========
async function adminUser() {
  const loader = document.getElementById('adminLoader');
  if (loader) loader.classList.remove('hidden');
  try {
    const res = await fetch(ADMIN_USER_URL);
    users = await res.json();
    renderTable(users);
    if (loader) loader.classList.add('hidden');
  } catch (error) {
    console.error("Error al cargar usuarios", error);
    if (loader) loader.classList.add('hidden');
  }
}

// ========== SEARCH BAR ==========
const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();

  const filtered = users.filter(
    (user) =>
      user.user_id.toString().toLowerCase().includes(query) ||
      (user.first_name && user.first_name.toLowerCase().includes(query)) ||
      (user.first_lastname &&
        user.first_lastname.toLowerCase().includes(query)) ||
      (user.user_email && user.user_email.toLowerCase().includes(query)) ||
      new Date(user.created_at).toLocaleString().toLowerCase().includes(query)
  );

  renderTable(filtered);
});

const deleteModal = document.getElementById("deleteModal");
const successModal = document.getElementById("successModal");
const cancelDelete = document.getElementById("cancelDelete");
const confirmDelete = document.getElementById("confirmDelete");
const closeSuccessModal = document.getElementById("closeSuccessModal");

let userToDelete = null;

// Display confirmation modal
window.Delete = function (id) {
  userToDelete = id;
  deleteModal.classList.remove("hidden");
};

// Cancel deletion
cancelDelete.addEventListener("click", () => {
  userToDelete = null;
  deleteModal.classList.add("hidden");
});

// Confirm deletion
confirmDelete.addEventListener("click", async () => {
  if (!userToDelete) return;

  try {
    const res = await fetch(`${USER_URL}/${userToDelete}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Error al eliminar");

    deleteModal.classList.add("hidden");
    userToDelete = null;

    successModal.classList.remove("hidden");

    adminUser();
  } catch (error) {
    console.error("Delete error", error);
    alert("Delete error");
  }
});

// Close success modal
closeSuccessModal.addEventListener("click", () => {
  successModal.classList.add("hidden");
  location.reload();
});

// -------- UPDATE MODALS --------
const editModal = document.getElementById("editModal");
const editUserForm = document.getElementById("editUserForm");
const cancelEdit = document.getElementById("cancelEdit");
const updateSuccessModal = document.getElementById("updateSuccessModal");
const closeUpdateSuccess = document.getElementById("closeUpdateSuccess");
const updateErrorModal = document.getElementById("updateErrorModal");
const closeUpdateError = document.getElementById("closeUpdateError");

// Abrir modal con datos del usuario
// Abrir modal con datos del usuario
window.Update = async function (id) {
  try {
    const res = await fetch(`${USER_URL}/${id}`);
    let user = await res.json();

    // Si la API devuelve un array, tomar el primer elemento
    if (Array.isArray(user)) {
      user = user[0];
    }

    // Rellenar formulario
    document.getElementById("editUserId").value = id;
    document.getElementById("first_name").value = user.first_name || "";
    document.getElementById("second_name").value = user.second_name || "";
    document.getElementById("first_lastname").value = user.first_lastname || "";
    document.getElementById("second_lastname").value =
      user.second_lastname || "";
    document.getElementById("user_email").value = user.user_email || "";
    document.getElementById("user_password").value = user.user_password || "";
    document.getElementById("user_photo").value = user.user_photo || "";
    document.getElementById("user_github").value = user.user_github || "";
    document.getElementById("user_linkedin").value = user.user_linkedin || "";
    document.getElementById("user_description").value =
      user.user_description || "";
    document.getElementById("user_alias").value = user.user_alias || "";

    // Mostrar modal
    editModal.classList.remove("hidden");
  } catch (error) {
    console.error("Error loading user data", error);
    updateErrorModal.classList.remove("hidden");
  }
};

// Cancelar edición
cancelEdit.addEventListener("click", () => {
  editModal.classList.add("hidden");
});

// Guardar cambios
editUserForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("editUserId").value;

  const updatedUser = {
    first_name: document.getElementById("first_name").value,
    second_name: document.getElementById("second_name").value,
    first_lastname: document.getElementById("first_lastname").value,
    second_lastname: document.getElementById("second_lastname").value,
    user_email: document.getElementById("user_email").value,
    user_password: document.getElementById("user_password").value,
    user_photo: document.getElementById("user_photo").value,
    user_github: document.getElementById("user_github").value,
    user_linkedin: document.getElementById("user_linkedin").value,
    user_description: document.getElementById("user_description").value,
    user_alias: document.getElementById("user_alias").value,
  };

  try {
    const res = await fetch(`${USER_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUser),
    });

    editModal.classList.add("hidden");

    if (!res.ok) {
      updateErrorModal.classList.remove("hidden");
      return;
    }

    updateSuccessModal.classList.remove("hidden");
    adminUser();
  } catch (error) {
    console.error("Error updating user", error);
    updateErrorModal.classList.remove("hidden");
  }
});

// Cerrar modales de éxito y error
closeUpdateSuccess.addEventListener("click", () => {
  updateSuccessModal.classList.add("hidden");
});
closeUpdateError.addEventListener("click", () => {
  updateErrorModal.classList.add("hidden");
});

// ========== INICIALIZAR ==========
adminUser();
