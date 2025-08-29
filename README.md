# 🌐 CoderSpace  

**CoderSpace** is a social platform for programmers that combines the best of **Facebook’s** social interaction with the technical collaboration of **GitHub**.  
A space where developers can **connect, collaborate, and grow together**.  

---

## 📖 Concept  

CoderSpace aims to become the **reference social network for programmers** of all levels, from students to industry professionals.  

It is designed for:  

- **Independent developers** who want to share projects and receive feedback.  
- **Students** who want to learn in community through learning boards.  
- **Mentors and experts** who want to guide new talent.  
- **Professionals** seeking networking opportunities and a dynamic portfolio to showcase their experience.  

In addition, it features an **AI moderator** that ensures shared content is **safe, constructive, and high quality**, creating a trustworthy community.  

---

## 🚀 Main Features  

Each feature is designed with a clear purpose to enhance user experience:  

- **Collaborative project development**  
  Users can create open projects where other programmers contribute with code, ideas, and improvements.  

- **Code and snippet sharing**  
  Publish snippets or repositories to receive feedback and suggestions from the community.  

- **Help and mentorship system**  
  Spaces to ask questions, solve doubts, and receive support directly from more experienced developers.  

- **Learning Boards**  
  Study paths organized by topics (e.g., Backend with Node.js, Frontend with React, Databases with MySQL).  

- **Dynamic and social profiles**  
  Each user has a portfolio-style profile, showcasing projects, skills, and experience.  
  - Users can **like, comment, follow profiles, and even correct shared code**.  

- **AI-powered moderation**  
  The system analyzes posts, comments, and code snippets to ensure no harmful or unsafe content is present.  

---

## 🛠️ Technologies Used  

### Frontend  
- HTML5  
- CSS3 / TailwindCSS  
- JavaScript (ES6+)  

### Backend  
- **Node.js** → Runtime environment for handling the server efficiently.  
- **Express.js** → Framework for managing routes, middleware, and backend controllers.  

### Database  
- MySQL  

### Development Tools  
- Git & GitHub  
- VS Code  
- **Fetch API** → Communication between frontend and backend.  

---

## 📂 Project Structure  

```
/CoderSpace
├── backend/ # Lógica del servidor
│ ├── app.js # Punto de entrada del servidor
│ ├── package.json # Dependencias del backend
│ ├── package-lock.json # Registro exacto de dependencias
│ ├── db/ # Configuración y conexión a la base de datos
│ └── routes/ # Rutas de la API (users, posts, comments)
│ ├── commentsRoutes.js
│ ├── postsRoutes.js
│ └── usersRoutes.js
│
├── client/ # Lado del cliente (frontend)
│ ├── assets/ # Recursos estáticos
│ │ ├── css/ # Hojas de estilo
│ │ │ └── feed.css
│ │ ├── img/ # Imágenes
│ │ │ └── default.jpeg
│ │ └── js/ # Scripts de frontend
│ │ ├── edit_profile.js
│ │ ├── feed.js
│ │ ├── login.js
│ │ ├── register.js
│ │ └── show_profile.js
│ │
│ └── views/ # Vistas HTML del sistema
│ ├── admin.html
│ ├── feed.html
│ ├── login.html
│ ├── modifyuser.html
│ ├── profile.html
│ ├── register.html
│ └── index.html
│
├── .env # Variables de entorno
├── .gitignore # Archivos y carpetas ignoradas por Git
└── README.md # Documentación del proyecto

```

---

## ⚡ How to Run the Project  

```bash
#1 Clone repository
git clone https://github.com/MateoAlRen/CoderSpace.git

#2 Enter project folder
cd CoderSpace

#3 Install dependencies
npm install

#4 Run development server
npm run dev

```

The application will be available at:**http://localhost:3000**  

---

- **Dependencias principales 📦** 

 * express - Routing and server management.

 * mysql2 - Connection with MySQL database.

 * dotenv - Environment variables management.

 * nodemon - Automatic server restart during development.

 * cors - Secure cross-origin requests.

---

## Clans 🏆

- **Berners lee**: Mateo, Jose, Yeferson, Thomas.

- **Ritchie**: Isabella


## Development Team 👥 

- **Product Owner (Mateo Algarin)** - Defines requirements, prioritizes features, and validates that the project meets community needs.
- **Scrum Master (Isabella Pulgarin)** - Facilitates SCRUM methodology, removes blockers, and ensures Agile practices are followed. 
- **Developer (Jose Cortes)** - Works on both frontend and backend, implements core features, and manages API integration.
- **Developer (Yeferson Garcia)** - Focuses on UI development, responsive design, and user experience.  
- **Developer (Thomas Noriega)** - backend and databases, designs RESTful APIs, and ensures system security and performance.  


