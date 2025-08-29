// Loader functions
function showLoader() {
  let loader = document.getElementById('profileLoader');
  if (!loader) {
    loader = document.createElement('div');
    loader.id = 'profileLoader';
    loader.className = 'fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900 bg-opacity-80';
    loader.innerHTML = `
      <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 border-b-4 border-purple-600"></div>
      <span class="ml-6 text-xl font-bold text-indigo-600 dark:text-purple-400">Loading profile...</span>
    `;
    document.body.appendChild(loader);
  }
  loader.classList.remove('hidden');
}

function hideLoader() {
  const loader = document.getElementById('profileLoader');
  if (loader) loader.classList.add('hidden');
}
const API_URL = "http://localhost:3000/users";
const userData = JSON.parse(localStorage.getItem("user"));
let USER_ID = userData.user_id;
// Si existe profileToShow en localStorage, usar ese id
const profileToShow = localStorage.getItem('profileToShow');
if (profileToShow) {
  USER_ID = profileToShow;
}

// Referencias al DOM
const profileImage = document.getElementById("profileImage");
const profileName = document.getElementById("profileName");
const profileDescription = document.getElementById("profileDescription");
const githubLink = document.getElementById("githubLink");
const linkedinLink = document.getElementById("linkedinLink");
const userAlias = document.getElementById("userAlias");
const notificationContainer = document.getElementById("notificationContainer");
const editBtn = document.getElementById("editProfileBtn");


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



async function loadUserProfile() {
  showLoader();
  try {
    const res = await fetch(`${API_URL}/${USER_ID}`);
    if (!res.ok) throw new Error("Error loading user profile");

    const data = await res.json();
    const user = data[0];

    // Limpiar el id de profileToShow después de mostrar el perfil
    if (localStorage.getItem('profileToShow')) {
      localStorage.removeItem('profileToShow');
    }

    const defaultIMG = "../assets/img/default.jpeg";
    if (profileImage) {
      if (user.user_photo) {
        profileImage.src = user.user_photo;
        profileImage.onerror = () => {
          profileImage.src = defaultIMG;
        };
      } else {
        profileImage.src = defaultIMG;
      }
      profileImage.alt = user.user_alias || "Profile photo";
    }

    const firstName = user.first_name || "User";
    const lastName = user.first_lastname;
    let fullName = firstName;
    if (lastName) {
      fullName += ` ${lastName}`;
    }
    if (profileName) {
      profileName.textContent = fullName;
    }
    if (userAlias) {
      userAlias.textContent = `${user.user_alias || "No alias"}`;
    }
    if (profileDescription) {
      profileDescription.textContent = user.user_description || "No description";
    }
    if (githubLink) {
      if (user.user_github) {
        githubLink.href = user.user_github;
        githubLink.style.display = 'inline-block';
      } else {
        githubLink.style.display = 'none';
      }
    }
    if (linkedinLink) {
      if (user.user_linkedin) {
        linkedinLink.href = user.user_linkedin;
        linkedinLink.style.display = 'inline-block';
      } else {
        linkedinLink.style.display = 'none';
      }
    }

    // Mostrar botón de editar solo si el perfil es el del usuario logueado
    if (editBtn) {
      if (userData && String(userData.user_id) === String(user.user_id)) {
        editBtn.style.display = 'inline-block';
      } else {
        editBtn.style.display = 'none';
      }
    }

    // Renderizar trending y luego los posts del usuario de forma secuencial
    if (typeof renderTopTrending === 'function') {
      await renderTopTrending();
    }
    if (typeof loadUserPosts === 'function') {
      await loadUserPosts();
    }
    // El loader se oculta solo después de cargar los posts
  } catch (err) {
    console.error(err);
    showNotification("❌ Could not load user profile", 'error');
    hideLoader();
  }
}

loadUserProfile();


const postsContainer = document.getElementById("postsContainer");
const API_POSTS_URL = "http://localhost:3000/post"; 
const API_LIKES_URL = "http://localhost:3000/likes";
const API_COMMENTS_URL = "http://localhost:3000/commentary";




async function getLikesCount(postId) {
  try {
    const res = await fetch(`${API_LIKES_URL}/post/${postId}`);
    if (!res.ok) {
      throw new Error("Error al obtener likes");
    }
    const likes = await res.json();
    return likes.length;
  } catch (err) {
    console.error(err);
    return 0;
  }
}


async function getCommentsCount(postId) {
  try {
    const res = await fetch(`${API_COMMENTS_URL}/post/${postId}`);
    if (!res.ok) {
      throw new Error("Error al obtener comentarios");
    }
    const comments = await res.json();
    return comments.length;
  } catch (err) {
    console.error(err);
    return 0;
  }

    // Mostrar botón de editar solo si el perfil es el del usuario logueado
    const editBtn = document.getElementById('editProfileBtn');
    const loggedUser = JSON.parse(localStorage.getItem('user'));
    if (editBtn) {
        if (loggedUser && String(loggedUser.user_id) === String(user.user_id)) {
            editBtn.style.display = 'inline-block';
        } else {
            editBtn.style.display = 'none';
        }
    }
}


async function renderPosts(posts) {

  // Limpiar el contenedor antes de renderizar para evitar duplicados
  postsContainer.innerHTML = '';

  if (posts.length === 0) {
    postsContainer.innerHTML = '<p class="text-center text-gray-500 dark:text-gray-400">No hay publicaciones para mostrar.</p>';
    hideLoader();
    return;
  }

  const postsWithStats = await Promise.all(posts.map(async post => {
    const likesCount = await getLikesCount(post.post_id);
    const commentsCount = await getCommentsCount(post.post_id);
    return { ...post, likesCount, commentsCount };
  }));

  postsWithStats.forEach((post, i) => {
    const avatarLetter = post.post_title ? post.post_title.charAt(0).toUpperCase() : 'P';
    // const timeAgo = formatTimeAgo(post.created_at); // Eliminado, no se mostrará la fecha

    // Animación: fade-in y slide-up
    const postDiv = document.createElement('div');
    postDiv.className = `bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 mb-4 opacity-0 translate-y-6 transition-all duration-700`;
    postDiv.innerHTML = `
      <div class="flex items-center gap-3 mb-3">
        <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
          ${avatarLetter}
        </div>
        <div>
          <h3 class="font-semibold">${post.post_title || 'Sin Título'}</h3>
          <!-- Fecha eliminada -->
        </div>
      </div>
      <p class="text-gray-600 dark:text-gray-400 text-sm mb-3">
        ${post.post_description || 'Sin descripción.'}
      </p>
      <h3 class="font-semibold">Mi codigo</h3>
      <p class="text-gray-600 dark:text-gray-400 text-sm mb-3">
        ${post.post_code || 'Sin descripción.'}
      </p>
      <div class="flex items-center gap-4 text-sm text-gray-500">
        <div class="flex items-center gap-1 text-gray-500 hover:text-blue-500 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
            <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227Z" />
          </svg>
          <span>${post.likesCount}</span>
        </div>
        <div class="flex items-center gap-1 text-gray-500 hover:text-blue-500 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-5 h-5" viewBox="0 0 24 24">
            <path d="M2 5a3 3 0 013-3h14a3 3 0 013 3v10a3 3 0 01-3 3H8l-4 4v-4H5a3 3 0 01-3-3V5z"/>
          </svg>
          <span>${post.commentsCount}</span>
        </div>
      </div>
    `;
    postsContainer.appendChild(postDiv);
    // Activar animación con pequeño delay para cada post
    setTimeout(() => {
      postDiv.classList.remove('opacity-0', 'translate-y-6');
      postDiv.classList.add('opacity-100', 'translate-y-0');
    }, 100 + i * 80);
  });

  // Ocultar loader solo cuando todos los posts estén realmente renderizados
  setTimeout(hideLoader, 100 + postsWithStats.length * 80);
}



async function loadUserPosts() {
  try {
    const res = await fetch(`${API_POSTS_URL}/user/${USER_ID}`); 
    if (!res.ok) {
      throw new Error("Error al obtener las publicaciones del usuario");
    }

    const posts = await res.json();
    renderPosts(posts);
    // Ocultar loader solo cuando los posts estén listos
    hideLoader();
  } catch (err) {
    console.error(err);
    if (postsContainer) {
      postsContainer.innerHTML = '<p class="text-center text-red-500">❌ Error al cargar las publicaciones.</p>';
    }
    hideLoader();
  }
}

// La carga de posts ahora solo se hace desde loadUserProfile para evitar duplicados