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

const tbody = document.getElementById("tbody");
const ADMIN_URL = "http://localhost:3000/post/user";
const POST_URL = "http://localhost:3000/post";

let posts = []; 

// Referencias a modales
const deleteModal = document.getElementById("deleteModal");
const successModal = document.getElementById("successModal");
const cancelDeleteBtn = document.getElementById("cancelDelete");
const confirmDeleteBtn = document.getElementById("confirmDelete");
const closeSuccessModalBtn = document.getElementById("closeSuccessModal");

let currentPostId = null; 

// Abrir modal de confirmación
window.Delete = function (id) {
  currentPostId = id;
  deleteModal.classList.remove("hidden");
};

// Cancelar eliminación
cancelDeleteBtn.addEventListener("click", () => {
  deleteModal.classList.add("hidden");
  currentPostId = null;
});

// Confirmar eliminación
confirmDeleteBtn.addEventListener("click", async () => {
  if (!currentPostId) return;

  try {
    const res = await fetch(`${POST_URL}/${currentPostId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      deleteModal.classList.add("hidden");
      successModal.classList.remove("hidden");
      adminPost(); // refrescar tabla
    } else {
      alert("Error deleting post");
    }
  } catch (error) {
    console.error("Delete error", error);
    alert("Delete error");
  } finally {
    currentPostId = null;
  }
});

// Cerrar modal de éxito
closeSuccessModalBtn.addEventListener("click", () => {
  successModal.classList.add("hidden");
  location.reload();
});

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
            <span class="font-medium">${element.post_id}</span>
          </div>
        </td>
        <td class="px-6 py-4">
          <div class="flex items-center gap-3">
            <span class="font-medium">${element.first_name}</span>
          </div>
        </td>
        <td class="px-6 py-4">
          <div>
            <p class="font-medium">${element.post_title}</p>
          </div>
        </td>
        <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
          ${new Date(element.created_at).toLocaleString()}
        </td>
        <td class="px-6 py-4">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
            ${element.total_likes} likes
          </span>
        </td>
        <td class="px-6 py-4">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
            ${element.total_comment} Comments
          </span>
        </td>
        <td class="px-6 py-4 text-right">
          <div class="flex items-center justify-end gap-2">
            <button
              class="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-red-600 dark:text-red-400 transition-colors"
              title="Delete"
              onclick="Delete('${element.post_id}')"
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

async function adminPost() {
  const loader = document.getElementById('adminLoader');
  if (loader) loader.classList.remove('hidden');
  try {
    const res = await fetch(ADMIN_URL);
    posts = await res.json(); 
    renderTable(posts);
    if (loader) loader.classList.add('hidden');
  } catch (error) {
    console.error("Error", error);
    if (loader) loader.classList.add('hidden');
  }
}

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();

  const filtered = posts.filter((post) =>
    post.post_id.toString().toLowerCase().includes(query) ||
    post.first_name.toLowerCase().includes(query) ||
    post.post_title.toLowerCase().includes(query) ||
    new Date(post.created_at).toLocaleString().toLowerCase().includes(query)
  );

  renderTable(filtered);
});

adminPost();
