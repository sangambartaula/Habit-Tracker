document.addEventListener("DOMContentLoaded", () => {
    const stats = JSON.parse(localStorage.getItem("dashboardStats")) || {};
    document.getElementById("streak").textContent = stats.streak || 0;
    document.getElementById("habitsDone").textContent = stats.habitsDone || 0;

    document.getElementById("totalPoints").textContent = stats.streak * 10;
    document.getElementById("milestones").textContent =
      stats.streak >= 10 ? "🔥 Pro" : "🚀 Beginner";
  });