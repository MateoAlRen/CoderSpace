// Dark mode toggle
const darkToggle = document.getElementById('dark-toggle');
const body = document.getElementById('appBody');
const html = document.documentElement;

// Initialize dark mode
if (localStorage.getItem('darkMode') === 'true' ||
    (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    html.classList.add('dark');
    darkToggle.textContent = '☀️';
} else {
    html.classList.remove('dark');
    darkToggle.textContent = '🌙';
}

// Toggle dark mode
darkToggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    const isDark = html.classList.contains('dark');
    localStorage.setItem('darkMode', isDark);
    darkToggle.textContent = isDark ? '☀️' : '🌙';
});

// Set current year
document.getElementById('year').textContent = new Date().getFullYear();

// Show body after initial setup
body.classList.remove('hidden');