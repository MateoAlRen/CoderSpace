// Mostrar loader al entrar a la página
showLoader();
let userData = JSON.parse(localStorage.getItem("user"));


if (userData) {
    if (userData.type === "admin") {
      window.location.href = "../views/admin_post.html";
} else if (!userData){  
  window.location.href = "../index.html";
}}


// --- COMMENT MODALS LOGIC ---

// Show comment error modal (content moderation)
// Hide comment modal and show error modal above (z-60)
function mostrarComentarioModal() {
    // Cierra el <dialog> nativo para eliminar el backdrop
    if (typeof commentModal.close === 'function') {
        commentModal.close();
    }
    commentModal.classList.add('hidden');
    document.getElementById('comentarioErrorModal').classList.remove('hidden');
    // Solo un modal visible a la vez
}

// Show comment fail modal (DB/network error)
// Hide comment modal and show fail modal above (z-60)
function mostrarComentarioFailModal() {
    commentModal.classList.add('hidden');
    document.getElementById('comentarioFailModal').classList.remove('hidden');
    // Only one modal visible at a time for stacking context
}

// Close comment error modal (no Try Again, just close)
window.cerrarComentarioErrorModal = function() {
    // Oculta el modal y el backdrop correctamente para permitir click inmediato en Close
    const errorModal = document.getElementById('comentarioErrorModal');
    if (errorModal) {
        errorModal.classList.add('hidden');
        // Oculta backdrop solo en este modal, restaurando display y clases
        const backdrop = errorModal.querySelector('.fixed.inset-0');
        if (backdrop) {
            backdrop.classList.add('hidden');
            backdrop.style.display = 'none';
        }
    }
    document.body.style.overflow = 'auto';

    // Reabrir el <dialog> nativo y enfocar el textarea
    if (commentModal) {
        commentModal.classList.remove('hidden');
        if (typeof commentModal.showModal === 'function') {
            commentModal.showModal();
        }
        setTimeout(() => {
            if (newCommentInput) {
                newCommentInput.focus();
                commentModal.scrollTop = 0;
            }
        }, 100);
    }
};

// Close comment fail modal and reopen comment modal
window.cerrarComentarioFailModal = function() {
    // Hide fail modal and its backdrop
    const failModal = document.getElementById('comentarioFailModal');
    failModal.classList.add('hidden');
    const failBackdrop = failModal.querySelector('.fixed.inset-0');
    if (failBackdrop) failBackdrop.classList.add('hidden');

    // Reopen comment modal and block scroll
    if (typeof commentModal.showModal === 'function') {
        if (!commentModal.open) {
            commentModal.classList.remove('hidden');
            commentModal.showModal();
        }
        document.body.style.overflow = 'hidden';
    } else {
        commentModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
    // Focus textarea and scroll modal to top
    setTimeout(() => {
        if (newCommentInput) {
            newCommentInput.focus();
            commentModal.scrollTop = 0;
        }
    }, 100);
};
// Pantalla de carga visual
function showLoader() {
  let loader = document.getElementById('loader');
  if (!loader) {
    loader = document.createElement('div');
    loader.id = 'loader';
    loader.className = 'fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900 bg-opacity-80';
    loader.innerHTML = `
      <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 border-b-4 border-purple-600"></div>
      <span class="ml-6 text-xl font-bold text-indigo-600 dark:text-purple-400">Loading...</span>
    `;
    document.body.appendChild(loader);
  }
  loader.classList.remove('hidden');
}

function hideLoader() {
  const loader = document.getElementById('loader');
  if (loader) loader.classList.add('hidden');
}

// 🌙 Toggle dark mode
const darkToggle = document.getElementById('darkToggle');

function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');

    if (isDark) {
        html.classList.remove('dark');
        darkToggle.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    } else {
        html.classList.add('dark');
        darkToggle.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    }
}
darkToggle.addEventListener('click', toggleTheme);

// 📝 Modal de nuevo post
var modal = document.getElementById('newPostModal');
var openBtn = document.getElementById('newPostBtn');
var closeBtn = document.getElementById('closeModalBtn');
var cancelBtn = document.getElementById('cancelBtn');
var backdrop = document.getElementById('modalBackdrop');

function openModal() {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    // Limpiar formulario al cerrar
    clearForm();
}

function clearForm() {
    document.getElementById('postTitle').value = '';
    document.getElementById('postDescription').value = '';
    document.getElementById('codeFragment').value = '';
}

openBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);
backdrop.addEventListener('click', closeModal);

// Hacer globales las funciones para el HTML
window.cerrarModal = function() {
    document.getElementById('errorModal').classList.add('hidden');
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
};
window.cerrarFailModal = function() {
    document.getElementById('failModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
    // Reabrir modal principal para que el usuario pueda reintentar
    modal.classList.remove('hidden');
};
window.cerrarSuccessModal = function() {
    const successModal = document.getElementById('successModal');
    successModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    location.reload();
};

// ⚠️ Funciones para modales de estado
function mostrarModal() {
    // Cerrar modal principal temporalmente para mostrar el modal de error
    modal.classList.add('hidden');
    document.getElementById('errorModal').classList.remove('hidden');
}

function mostrarFailModal() {
    // Cerrar modal principal temporalmente para mostrar el modal de fallo
    modal.classList.add('hidden');
    document.getElementById('failModal').classList.remove('hidden');
}

function mostrarSuccessModal() {
    // Cerrar modal principal permanentemente en caso de éxito
    modal.classList.add('hidden');
    document.getElementById('successModal').classList.remove('hidden');
}

// Cerrar modales con Escape - jerarquía correcta
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        // Prioridad: primero los modales secundarios, luego el principal
        if (!document.getElementById('successModal').classList.contains('hidden')) {
            cerrarSuccessModal();
        } else if (!document.getElementById('errorModal').classList.contains('hidden')) {
            cerrarModal();
        } else if (!document.getElementById('failModal').classList.contains('hidden')) {
            cerrarFailModal();
        } else if (!modal.classList.contains('hidden')) {
            closeModal();
        }
    }
});

// 🚪 Logout
let logOut = document.getElementById("logoutBtn");
logOut.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("user");
    window.location.href = "../index.html";
});

// 👤 Render user
async function renderUser() {
  const userData = JSON.parse(localStorage.getItem("user"));
  
  if (userData) {
    document.getElementById("userPfp").innerHTML = `
      <div class="h-10 w-10 rounded-full bg-center bg-cover" style="background-image: url('${userData.user_photo || "../assets/img/default.jpeg"}')"></div>
    `;
    document.getElementById("userName").innerHTML = `
      <span>${userData.first_name}</span>
    `;
  } else {
    console.error("No se encontraron datos de usuario en localStorage.");
  }
}

renderUser();

// 📤 Publicar post
let publishCode = document.getElementById("publishBtn");

publishCode.addEventListener("click", (e) => {
    e.preventDefault();

    let title = document.getElementById("postTitle").value.trim();
    let description = document.getElementById("postDescription").value.trim();
    let code = document.getElementById("codeFragment").value.trim();

    if (!title || !description) {
        alert('Por favor completa título y descripción');
        return;
    }

    let userId = userData.user_id;
    let post = {
        user_id: userId,
        post_title: title,
        post_description: description,
        post_code: code
    };

    addPost(post);
});

// 🔗 Enviar post al backend
async function addPost(post) {
    try {
        const res = await fetch("http://localhost:3000/post", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(post)
        });

        if (!res.ok) {
            if (res.status === 400) {
                mostrarModal();
                console.error(`Not appropriate... ${res.status}`);
            } else {
                mostrarFailModal();
                console.error(`Request failed: ${res.status}`);
            }
        } else {
            mostrarSuccessModal();
            console.log("Post created successfully ✅");
        }
    } catch (error) {
        mostrarFailModal();
        console.error(`Request error: ${error}`);
    }
}

let loading = false;
let allPosts = [];   // aquí guardamos todos los posts
let currentIndex = 0; // índice de posts ya cargados
const batchSize = 5; // cantidad de posts por scroll
let firstLoad = true; // para controlar el loader inicial

// función para traer todos los posts (una sola vez)
async function fetchAllPosts() {
  if (allPosts.length > 0) return; // ya los trajimos
  const res = await fetch("http://localhost:3000/post/postdata");
  allPosts = await res.json();
}


async function renderTopTrending() {
  const sidebarList = document.getElementById('ul_trending');
  await fetchAllPosts(); // asegura que ya tengas los posts

  // traer likes y comentarios por cada post de forma secuencial
  const postsWithData = [];
  for (const post of allPosts) {
    const resLikes = await fetch(`${API_LIKES_URL}/post/${post.post_id}/count`);
    const likesData = resLikes.ok ? await resLikes.json() : { like_count: 0 };

    const resComments = await fetch(`${API_COMMENTS_URL}/post/${post.post_id}/count`);
    const commentsData = resComments.ok ? await resComments.json() : { comment_count: 0 };

    postsWithData.push({
      ...post,
      like_count: likesData.like_count,
      comment_count: commentsData.comment_count
    });
  }

  // ordenar y tomar top 3
  postsWithData.sort((a, b) => b.like_count - a.like_count);
  const top3 = postsWithData.slice(0, 3);

  // limpiar y pintar
  sidebarList.innerHTML = '';
  for (const post of top3) {
    const li = document.createElement('li');
    li.classList.add('group', 'cursor-pointer');
    li.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="w-12 h-12 rounded-full bg-center bg-cover flex-shrink-0" 
             style="background-image: url('${post.user_photo || "../assets/img/default.jpeg"}')"></div>
        <div class="flex-1">
          <p class="font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            ${post.title}
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">${post.description}</p>
          <div class="flex items-center gap-2 text-xs text-gray-500">
            <span>⭐ ${post.like_count}</span>
            <span>💬 ${post.comment_count}</span>
            <span class="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">Trending</span>
          </div>
        </div>
      </div>
    `;
    sidebarList.appendChild(li);
  }
}


const API_LIKES_URL = "http://localhost:3000/likes";
const API_COMMENTS_URL = "http://localhost:3000/commentary";
const API_USERS_URL = "http://localhost:3000/users";
const USER_ID = userData ? userData.user_id : null;
// función para renderizar los siguientes 5 posts

async function loadPosts() {
  if (loading) return;
  await fetchAllPosts();
  if (currentIndex >= allPosts.length) return;

  loading = true;
  if (firstLoad) {
    showLoader();
  }

  const container = document.getElementById("renderPosts");
  const nextPosts = allPosts.slice(currentIndex, currentIndex + batchSize);

  for (const post of nextPosts) {
    // Traer todos los likes del post
    const resLikesCount = await fetch(`${API_LIKES_URL}/post/${post.post_id}/count`);
    const likesCountData = resLikesCount.ok ? await resLikesCount.json() : { like_count: 0 };

    // Obtener solo el total de comentarios
    const resCommentsCount = await fetch(`${API_COMMENTS_URL}/post/${post.post_id}/count`);
    const commentsCountData = resCommentsCount.ok ? await resCommentsCount.json() : { comment_count: 0 };

    // Si el usuario actual ya le dio like
    const resLikes = await fetch(`${API_LIKES_URL}/post/${post.post_id}`);
    const likes = resLikes.ok ? await resLikes.json() : [];
    const userLike = likes.find(like => like.user_id === USER_ID);

    // Crear el elemento post con fade-in
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = `
      <article class="card mt-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 hover:shadow-lg transition-shadow opacity-0 transition-opacity duration-700">
        <div class="flex items-center gap-3 mb-4">
          <div class="h-10 w-10 rounded-full bg-center bg-cover" style="background-image: url('${post.user_photo || "../assets/img/default.jpeg"}')"></div>
          <div>
            <p class="font-semibold">${post.user_name}</p>
          </div>
        </div>
        <h2 class="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
          ${post.title}
        </h2>
        <p class="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
          ${post.description}
        </p>
        <div class="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-green-400 text-sm font-mono rounded-xl p-4 overflow-x-auto mb-4">
          <pre>${post.code || ""}</pre>
        </div>
        <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-800">
          <div class="flex items-center gap-6">
          <button class="like-btn flex items-center gap-1 transition-colors"  
                  data-post-id="${post.post_id}"
                  data-liked="${!!userLike}"
                  ${userLike ? `data-like-id="${userLike.like_id}"` : ""}>
            <span class="like-emoji ${userLike ? "text-indigo-600 dark:text-indigo-400" : ""}">👍</span>
            <span class="like-count">${likesCountData.like_count}</span> Likes
          </button>
            <button class="comment-button flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" data-post-id="${post.post_id}">
              💬 <span class="comment-count">${commentsCountData.comment_count}</span> Comment
            </button>
          </div>
        </div>
      </article>
    `;
    const postElement = tempDiv.firstElementChild;
    container.appendChild(postElement);
    // Forzar el fade-in
    setTimeout(() => {
      postElement.classList.remove('opacity-0');
    }, 50);
  }

  currentIndex += batchSize;
  loading = false;
  if (firstLoad) {
    hideLoader();
    firstLoad = false;
  }
}

// Cargar trending y posts en paralelo al inicio
Promise.all([
  renderTopTrending(),
  loadPosts()
]);

// Navegar al perfil de usuario al hacer click en avatar o nombre de post
document.addEventListener('click', function(e) {
    // Avatar o nombre en post
    const avatar = e.target.closest('.h-10.w-10.rounded-full');
    const name = e.target.closest('.font-semibold');
    let postCard = null;
    if (avatar) {
        postCard = avatar.closest('article');
    } else if (name) {
        postCard = name.closest('article');
    }
    if (postCard) {
        // Buscar el post en allPosts usando el id del post
        const postId = postCard.querySelector('.like-btn')?.dataset?.postId;
        const postObj = allPosts.find(p => String(p.post_id) === String(postId));
        if (postObj && postObj.user_id) {
            const userData = JSON.parse(localStorage.getItem('user'));
            // Siempre navega a profile.html, usando localStorage para distinguir el usuario
            if (userData && String(userData.user_id) === String(postObj.user_id)) {
                window.location.href = '../views/profile.html';
            } else {
                localStorage.setItem('profileToShow', postObj.user_id);
                window.location.href = '../views/profile.html';
            }
        }
    }
});

// evento scroll para cargar más
window.addEventListener("scroll", () => {
  // Cargar más posts cuando el usuario esté a 3000px del fondo
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 3000) {
    loadPosts();
  }
});

//Elements of the DOM of the comments modal
const commentModal = document.getElementById("commentModal");
const closeCommentsBtn = document.getElementById("closeCommentsBtn");
const commentsContainer = document.getElementById("commentsContainer");
const newCommentForm = document.getElementById("newCommentForm");
const newCommentInput = document.getElementById("newCommentInput");

// Variable to store the ID of the current modal post
let currentPostId = null;

// Function to automatically adjust the height of the textarea
const resizeTextarea = () => {
  newCommentInput.style.height = 'auto';
  newCommentInput.style.height = `${newCommentInput.scrollHeight}px`;
};

newCommentInput.addEventListener('input', resizeTextarea);


function createCommentElement(comment, userName) {
  const avatarLetter = userName.charAt(0).toUpperCase();

  const commentElement = document.createElement('div');
  commentElement.classList.add('flex', 'gap-4', 'bg-gray-100', 'dark:bg-gray-800', 'p-4', 'rounded-xl');
  commentElement.innerHTML = `
    <div class="h-10 w-10 flex items-center justify-center rounded-full bg-indigo-500 dark:bg-indigo-600 text-white font-bold text-lg shrink-0">
      ${avatarLetter}
    </div>
    <div class="flex-grow">
      <p class="font-bold text-gray-900 dark:text-gray-100">${userName}</p>
      <p class="text-gray-700 dark:text-gray-300">${comment.comment_description}</p>
    </div>
  `;
  return commentElement;
}



async function fetchCommentsForPost(postId) {
  try {
    const res = await fetch(`${API_COMMENTS_URL}/post/${postId}`);
    if (!res.ok) throw new Error("Error obtaining comments");
    const comments = await res.json();
    return comments;
  } catch (err) {
    console.error(err);
    return [];
  }
}



async function fetchUserById(userId) {
  try {
    const res = await fetch(`${API_USERS_URL}/${userId}`);
    if (!res.ok) throw new Error("Error obtaining the user");
    const user = await res.json();
    return user[0];
  } catch (err) {
    console.error(err);
    return null;
  }
}


async function renderComments(postId) {
  commentsContainer.innerHTML = '<p class="text-center text-gray-500 dark:text-gray-400">Loading comments...</p>';
  const comments = await fetchCommentsForPost(postId);
  if (comments.length === 0) {
    commentsContainer.innerHTML = '<p class="text-center text-gray-500 dark:text-gray-400">Be the first to comment!</p>';
    return;
  }

  const res = await fetch(API_USERS_URL);
  const allUsers = await res.json();

  commentsContainer.innerHTML = '';
  comments.forEach(comment => {
    const user = allUsers.find(u => u.user_id === comment.user_id);
    const userFirstName = user ? user.first_name : 'Usuario Anónimo';
    const commentElement = createCommentElement(comment, userFirstName);
    commentsContainer.appendChild(commentElement);
  });
};


// Event to close the modal
closeCommentsBtn.addEventListener('click', () => {
  commentModal.close();
  commentModal.classList.add("hidden");
});

// Event to submit a new comment
newCommentForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const commentText = newCommentInput.value.trim();
  if (commentText === '') return;

  if (!currentPostId || !USER_ID) {
    console.error('Error: Post ID or User ID are not defined.');
    return;
  }
  try {
    const res = await fetch(`${API_COMMENTS_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        comment_description: commentText,
        user_id: USER_ID,
        post_id: currentPostId
      })
    });

    if (!res.ok) {
      if (res.status === 400) {
        mostrarComentarioModal();
        console.error(`Comment not appropriate... ${res.status}`);
      } else {
        mostrarComentarioFailModal();
        console.error(`Database error: ${res.status}`);
      }
      return;
    }

    const user = await fetchUserById(USER_ID);
    const userFirstName = user ? user.first_name : 'Usuario Anónimo';
    const newComment = {
      comment_description: commentText,
      user_id: USER_ID,
      post_id: currentPostId
    };
    const newCommentElement = createCommentElement(newComment, userFirstName);
    commentsContainer.appendChild(newCommentElement);
    newCommentInput.value = '';
    resizeTextarea();
    // Actualizar contador usando el endpoint de count
    const commentBtn = document.querySelector(`.comment-button[data-post-id="${currentPostId}"]`);
    const countEl = commentBtn.querySelector(".comment-count");
    const countRes = await fetch(`${API_COMMENTS_URL}/post/${currentPostId}/count`);
    const countData = await countRes.json();
    countEl.textContent = countData.comment_count;
    commentsContainer.scrollTop = commentsContainer.scrollHeight;
  } catch (err) {
    mostrarComentarioFailModal();
    console.error('Error sending comment:', err);
  }
});


// Global listener for all comment buttons.
document.addEventListener('click', (event) => {
  const commentButton = event.target.closest('.comment-button');
  if (commentButton) {
    currentPostId = commentButton.dataset.postId;
    if (currentPostId) {
        commentModal.classList.remove("hidden");
        commentModal.showModal();
        renderComments(currentPostId);
    }
  }
});


// Global listener for all likes buttons.
document.addEventListener("click", async (e) => {
  const likeBtn = e.target.closest(".like-btn");
  if (likeBtn) {
    const postId = likeBtn.dataset.postId;
    const likeCountEl = likeBtn.querySelector(".like-count");
    let liked = likeBtn.dataset.liked === "true";
    const likeEmoji = likeBtn.querySelector(".like-emoji");

    if (!liked) {
      // Dar like
      try {
        const res = await fetch(API_LIKES_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: USER_ID, post_id: postId })
        });

        if (res.ok) {
          const data = await res.json();
          likeBtn.dataset.liked = "true";
          likeBtn.dataset.likeId = data.likeId || "";

           // O usar el endpoint de count
          const countRes = await fetch(`${API_LIKES_URL}/post/${postId}/count`);
          const countData = await countRes.json();
          likeCountEl.textContent = countData.like_count;

          likeEmoji.classList.add("text-indigo-600", "dark:text-indigo-400"); 
        }
      } catch (err) {
        console.error("Error adding like:", err);
      }
    } else {
      // Quitar like
      const likeId = likeBtn.dataset.likeId;
      try {
        const res = await fetch(`${API_LIKES_URL}/${likeId}`, { method: "DELETE" });
        if (res.ok) {
          // Obtener el total actualizado de likes
          const countRes = await fetch(`${API_LIKES_URL}/post/${postId}/count`);
          const countData = await countRes.json();
          likeCountEl.textContent = countData.like_count; // contador actualizado

          likeBtn.dataset.liked = "false";
          likeBtn.removeAttribute("data-like-id");
          likeEmoji.classList.remove("text-indigo-600", "dark:text-indigo-400"); // Quita el color
        }
      } catch (err) {
        console.error("Error deleting like:", err);
      }
    }
  }
});

