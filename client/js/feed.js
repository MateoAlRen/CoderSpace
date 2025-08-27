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



