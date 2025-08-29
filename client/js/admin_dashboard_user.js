document.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("user");
  if (!user) {
    window.location.href = "../views/login.html";
  } else if (user.type === "user") {
    window.location.href = "../views/feed.html";
  } else {
    document.getElementById("appBody").classList.remove("hidden");
  }
});

const USER_URL = "http://localhost:3000/users/count";
const Dashboard = document.getElementById("Dashboard");

async function adminDashboardUser() {
  try {
    const res = await fetch(USER_URL);
    const data = await res.json();

    Dashboard.innerHTML = ``;

    data.forEach((element) => {
      Dashboard.innerHTML += `
        <div
          class="grid grid-cols-1 gap-6 mb-8 max-w-md mx-auto"
          id="statsCards"
        >
          <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <div class="flex items-center justify-center gap-4 ">
              <div class="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
                <svg
                  class="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <div>
                <p class="text-2xl font-bold">${element.total_user}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">Users</p>
              </div>
            </div>
          </div>
        </div>
      `;
    });
  } catch (error) {
    console.error("Error");
  }
}

adminDashboardUser();
