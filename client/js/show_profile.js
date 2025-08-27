const API_URL = "http://localhost:3000/users";
let userData = JSON.parse(localStorage.getItem("user")); 
const USER_ID = userData.user_id

const profileImage = userData.user_photo;
const profileName = userData.firstName;
const profileDescription = userData.user_description;
const githubLink = userData.user_github;
const linkedinLink = userData.user_linkedin;
const userAlias = userData.userAlias;
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



async function loadUserProfile() {
  try {
    const res = await fetch(`${API_URL}/${USER_ID}`);
    if (!res.ok) throw new Error("Error al obtener usuario");

    const data = await res.json();
    const user = data[0];


    const defaultIMG = "../../../assets/default.jpg";
    if (profileImage) {
      if (user.user_photo) {
        profileImage.src = user.user_photo;

        profileImage.onerror = () => {
          profileImage.src = defaultIMG;
        };
      } else {
        profileImage.src = defaultIMG;
      }
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
    showNotification("❌ No se pudo cargar el perfil del usuario", 'error');
  }
}

loadUserProfile();


const postsContainer = document.getElementById("postsContainer");
const API_POSTS_URL = "http://localhost:3000/post"; 
const API_LIKES_URL = "http://localhost:3000/likes";
const API_COMMENTS_URL = "http://localhost:3000/commentary";


function formatTimeAgo(dateString) {
  const postDate = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - postDate) / 1000);

  const intervals = [
    { name: 'año', seconds: 31536000 },
    { name: 'mes', seconds: 2592000 },
    { name: 'día', seconds: 86400 },
    { name: 'hora', seconds: 3600 },
    { name: 'minuto', seconds: 60 }
  ];

  for (const interval of intervals) {
    const value = seconds / interval.seconds;
    if (value > 1) {
      const roundedValue = Math.floor(value);
      const unit = roundedValue === 1 ? interval.name : `${interval.name}s`;
      return `Hace ${roundedValue} ${unit}`;
    }
  }

  return `Hace ${Math.floor(seconds)} segundos`;
}


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
}


async function renderPosts(posts) {

  postsContainer.innerHTML = '';

  if (posts.length === 0) {
    postsContainer.innerHTML = '<p class="text-center text-gray-500 dark:text-gray-400">No hay publicaciones para mostrar.</p>';
    return;
  }

  const postsWithStats = await Promise.all(posts.map(async post => {
    const likesCount = await getLikesCount(post.post_id);
    const commentsCount = await getCommentsCount(post.post_id);
    return { ...post, likesCount, commentsCount };
  }));

  postsWithStats.forEach(post => {
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
      </div>
    `;
  
    postsContainer.innerHTML += postHTML;
  });
}



async function loadUserPosts() {
  try {
    const res = await fetch(`${API_POSTS_URL}/user/${USER_ID}`); 
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