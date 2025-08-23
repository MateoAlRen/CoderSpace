

const formRegister = document.getElementById("formRegister");
    
formRegister.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    if (data.name.trim() == "") {
        alert("El campo de nombre no puede estar vacio");
        return;
    }
    if (data.email.trim() == "") {
        alert("El campo de email no puede estar vacio");
        return;
    }if (data.password.trim() == "") {
        alert("El campo de contraseña no puede estar vacio");
        return;
    }if (data.password_confirm.trim() == "") {
        alert("El campo de confirmar contraseña no puede estar vacio");
        return;
    }if (data.password !== data.password_confirm) {
        alert("Las contraseñas no coinciden");
        return;
    }
    
});








document.getElementById('year').textContent = new Date().getFullYear();
    const toggle = document.getElementById('dark-toggle');
    const root = document.documentElement;
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    }
    toggle.addEventListener('click', () => {
      root.classList.toggle('dark');
      if (root.classList.contains('dark')) {
        localStorage.theme = 'dark';
        toggle.textContent = "☀️";
      } else {
        localStorage.theme = 'light';
        toggle.textContent = "🌙";
      }
    });

    toggle.textContent = root.classList.contains('dark') ? "☀️" : "🌙";