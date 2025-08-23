


    const formLogin = document.getElementById("formLogin");
    
                    formLogin.addEventListener("submit", async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const data = Object.fromEntries(formData.entries());
                        if (data.email.trim() == "") {
                            alert("El campo de email no puede estar vacio");
                            return;
                        }
                        if (data.password.trim() == "") {
                            alert("El campo de password no puede estar vacio");
                            return;
                        }
                        
                    });









//mode toggle
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