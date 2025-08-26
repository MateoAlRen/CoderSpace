const API_URL = "http://localhost:3000/users";
const USER_ID = localStorage.getItem("userId")

const profileImage = document.getElementById("profileImage");
const profileName = document.getElementById("profileName");
const profileDescription = document.getElementById("profileDescription");
const githubLink = document.getElementById("githubLink");
const linkedinLink = document.getElementById("linkedinLink");
const userAlias = document.getElementById("userAlias");


async function loadUserProfile() {
  try {
    const res = await fetch(`${API_URL}/${USER_ID}`);
    if (!res.ok) throw new Error("Error al obtener usuario");

    const data = await res.json();
    const user = data[0];


    const defaultIMG = "../../../assets/default.jpg";
    if (profileImage) {
      profileImage.src = user.user_photo || defaultIMG;
      profileImage.alt = user.user_alias || "Foto de perfil";
    }

    const firstName = user.first_name || "Usuario";
    const lastName = user.first_lastname; 

    let fullName = firstName; 

    if (lastName) {
    fullName += ` ${lastName}`;
    }

    if (profileName) {
      profileName.textContent = fullName;
    }

    if (userAlias) {
      userAlias.textContent = `${user.user_alias || "Sin alias"}`;
    }

    if (profileDescription) {
      profileDescription.textContent = user.user_description || "Sin descripción";
    }

    if (githubLink && user.user_github) {
      githubLink.href = user.user_github;
      githubLink.style.display = 'inline-block'; 
    } else if (githubLink) {
      githubLink.style.display = 'none';
    }
    
    if (linkedinLink && user.user_linkedin) {
      linkedinLink.href = user.user_linkedin;
      linkedinLink.style.display = 'inline-block';
    } else if (linkedinLink) {
      linkedinLink.style.display = 'none';
    }

  } catch (err) {
    console.error(err);
    alert("❌ No se pudo cargar el perfil del usuario");
  }
}

loadUserProfile();


const postsContainer = document.getElementById("postsContainer");
const API_POSTS_URL = "http://localhost:3000/post"; 

function formatTimeAgo(dateString) {
  const postDate = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - postDate) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) {
    return `Hace ${Math.floor(interval)} años`;
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return `Hace ${Math.floor(interval)} meses`;
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return `Hace ${Math.floor(interval)} días`;
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return `Hace ${Math.floor(interval)} horas`;
  }
  interval = seconds / 60;
  if (interval > 1) {
    return `Hace ${Math.floor(interval)} minutos`;
  }
  return `Hace ${Math.floor(seconds)} segundos`;
}


function renderPosts(posts) {
  if (!postsContainer) {
    console.error("El contenedor de posts con ID 'postsContainer' no fue encontrado.");
    return;
  }

  postsContainer.innerHTML = '';

  if (posts.length === 0) {
    postsContainer.innerHTML = '<p class="text-center text-gray-500 dark:text-gray-400">No hay publicaciones para mostrar.</p>';
    return;
  }

  posts.forEach(post => {
    const avatarLetter = post.post_title ? post.post_title.charAt(0).toUpperCase() : 'P';
    const timeAgo = formatTimeAgo(post.created_at);

    const postHTML = `
      <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 mb-4">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
            ${avatarLetter}
          </div>
          <div>
            <h3 class="font-semibold">${post.post_title || 'Sin Título'}</h3>
            <p class="text-sm text-gray-500">${timeAgo}</p>
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
          <span>⭐ 24</span>
          <span>🍴 8</span>
          <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
            HTML
          </span>
        </div>
      </div>
    `;

    postsContainer.innerHTML += postHTML;
  });
}


async function loadUserPosts() {
  try {
    const res = await fetch(`${API_POSTS_URL}/${USER_ID}`); 
    if (!res.ok) {
      throw new Error("Error al obtener las publicaciones del usuario");
    }

    const posts = await res.json();
    renderPosts(posts);

  } catch (err) {
    console.error(err);
    if (postsContainer) {
      postsContainer.innerHTML = '<p class="text-center text-red-500">❌ Error al cargar las publicaciones.</p>';
    }
  }
}

loadUserPosts();