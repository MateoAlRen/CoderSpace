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

const POST_URL = "http://localhost:3000/post/count";
const Dashboard = document.getElementById("Dashboard");

async function adminDashboardPost() {
  try {
    const res = await fetch(POST_URL);
    const data = await res.json();

    Dashboard.innerHTML = ``;

    data.forEach((element) => {
      Dashboard.innerHTML += `
        <!-- Stats Cards -->
        <div
          class="grid grid-cols-1 gap-6 mb-8 max-w-md mx-auto"
          id="statsCards"
        >
          <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <div class="flex items-center justify-center gap-4">
              <div class="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <p class="text-2xl font-bold">${element.total_post}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Total Post
                </p>
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

adminDashboardPost();
