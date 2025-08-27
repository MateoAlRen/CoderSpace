let userData = JSON.parse(localStorage.getItem("user"));

if (!userData){
    window.location.href = "../index.html"
}
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

const modal = document.getElementById('newPostModal');
const openBtn = document.getElementById('newPostBtn');
const closeBtn = document.getElementById('closeModalBtn');
const cancelBtn = document.getElementById('cancelBtn');
const backdrop = document.getElementById('modalBackdrop');

function openModal() {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Evita scroll del fondo
}

function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto'; // Restaura el scroll
}

openBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);
backdrop.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});

let logOut = document.getElementById("logoutBtn");

logOut.addEventListener("click", (e) =>{
    e.preventDefault();
    localStorage.removeItem("user");
})


async function renderUser() {
    document.getElementById("userPfp").innerHTML = `
        <img src="${userData.user_photo}" alt="img"  class="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 hover:scale-105 transition-transform bg-cover bg-center">
    `

    document.getElementById("userName").innerHTML =`
        <span>${userData.first_name}</span>
    `
};

renderUser();


const API_COMMENTS_URL = "http://localhost:3000/commentary";
const API_USERS_URL = "http://localhost:3000/users";
const USER_ID = userData ? userData.user_id : null;

//Elements of the DOM of the comments modal
const commentModal = document.getElementById("commentModal");
const closeModalBtn = document.getElementById("closeModalBtn");
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
}




// Event to close the modal
closeModalBtn.addEventListener('click', () => {
  commentModal.close();
  commentModal.classList.add("hidden");
});

// Event to submit a new comment
newCommentForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const commentText = newCommentInput.value.trim();
  if (commentText === '') return;

  if (!currentPostId || !USER_ID) {
    console.error('Error: Post ID o User ID no están definidos.');
    return;
  }
  
  try {
    const res = await fetch(`${API_COMMENTS_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        comment_description: commentText,
        user_id: USER_ID,
        post_id: currentPostId
      })
    });

    if (!res.ok) throw new Error("Error sending the comment");
    
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

    commentsContainer.scrollTop = commentsContainer.scrollHeight;
    
  } catch (err) {
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
