document.addEventListener("DOMContentLoaded", () => {
  // Initialize notification system
  if (typeof initializeNotificationSystem === 'function') {
    initializeNotificationSystem();
    startNotificationSystem();
  }
  
  // Check for reminders immediately and then every minute
  if (typeof checkReminders === 'function') {
    checkReminders();
    setInterval(checkReminders, 60000);
  }

  let totalPoints = Number.parseInt(localStorage.getItem("totalPoints") || "0");
  let streak = Number.parseInt(localStorage.getItem("streak") || "0");
  let streakUpdatedToday = localStorage.getItem("streakUpdatedDate") === new Date().toISOString().slice(0, 10);

  const customScores = JSON.parse(localStorage.getItem("customScores") || "[]");
  let completedMissions = JSON.parse(localStorage.getItem("dailyMissionsDone") || "[]");
  const completedTasks = new Map();

  // Initialize the UI
  document.getElementById("streakCount").innerText = streak;
  document.getElementById("totalPoints").innerText = totalPoints;

  // Load initial data
  loadCompletedTasks();
  loadDailyMissions();
  renderLeaderboard();
  updateRefreshCountdown();
  setInterval(updateRefreshCountdown, 1000);

  // Make stats draggable
  const statsElement = document.querySelector('.stats');
  if (statsElement) {
    makeDraggable(statsElement);
  }

  function updateScoreDisplay() {
    document.getElementById("totalPoints").innerText = totalPoints
    localStorage.setItem("totalPoints", totalPoints.toString())
  }

  function refreshMissions() {
    localStorage.removeItem("dailyMissions")
    localStorage.removeItem("dailyMissionsDone")
    completedMissions = []
    loadDailyMissions()
  }

  function completeHabit(button, points) {
    const parent = button.parentElement
    const completedSpan = parent.querySelector(".completed")
    const progress = parent.querySelector("progress")
    const taskSelect = parent.querySelector(".task-select")

    if (taskSelect && taskSelect.value === "") {
      if (typeof showNotificationPopup === 'function') {
        showNotificationPopup("Please select a task before completing.", true);
      } else {
        alert("Please select a task before completing.");
      }
      return
    }
    const selectedTask = taskSelect.value.trim()
    const habitType = parent.querySelector("h3").innerText
    const taskKey = `${habitType}-${selectedTask}`

    // Initialize the Map for this habit type if it doesn't exist
    if (!completedTasks.has(habitType)) {
      completedTasks.set(habitType, new Set())
    }

    const taskSet = completedTasks.get(habitType)

    if (taskSet.has(selectedTask)) {
      if (typeof showNotificationPopup === 'function') {
        showNotificationPopup("You have already completed this task! Please select a different one.", true);
      } else {
        alert("You have already completed this task! Please select a different one.");
      }
      return
    }

    let completed = Number.parseInt(completedSpan.innerText)
    if (completed >= 5) {
      if (typeof showNotificationPopup === 'function') {
        showNotificationPopup("Daily limit is 5!! Please complete other activities or come back tomorrow.", true);
      } else {
        alert("Daily limit is 5!! Please complete other activities or come back tomorrow.");
      }
      return
    }

    taskSet.add(selectedTask)

    // Save completed tasks to localStorage
    const tasksToSave = {}
    completedTasks.forEach((value, key) => {
      tasksToSave[key] = Array.from(value)
    })
    localStorage.setItem("completedTasks", JSON.stringify(tasksToSave))

    for (const option of taskSelect.options) {
      if (option.value.trim() === selectedTask) {
        option.textContent = "✅ " + option.textContent
        option.disabled = true
        option.style.backgroundColor = "#10b981"
        option.style.color = "white"
      }
    }

    completed++
    completedSpan.innerText = completed
    progress.value = completed
    totalPoints += points
    updateScoreDisplay()
    taskSelect.selectedIndex = 0
    celebrate()
    checkIfEverythingCompleted()
  }

  function checkIfEverythingCompleted() {
    const allCompleted = [...document.querySelectorAll(".feature-card")].every((card) => {
      const completedSpan = card.querySelector(".completed")
      return Number.parseInt(completedSpan.innerText) >= 5
    })

    const allMissionsCompleted = completedMissions.length >= 3

    if (allCompleted && allMissionsCompleted) {
      superCelebrate()
    }
  }

  function updateRefreshCountdown() {
    const now = new Date()
    const nextMidnight = new Date()
    nextMidnight.setHours(24, 0, 0, 0)

    const diff = nextMidnight - now

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    const timerText = `🕒 New daily tasks in: ${hours}h ${minutes}m ${seconds}s`
    document.getElementById("refreshTimer").innerText = timerText
  }

  function saveScore() {
    const name = document.getElementById("playerName").value.trim()
    if (!name) {
      if (typeof showNotificationPopup === 'function') {
        showNotificationPopup("Please enter your name before saving your score.", true);
      } else {
        alert("Please enter your name before saving your score.");
      }
      return
    }

    customScores.push({ name, points: totalPoints })
    localStorage.setItem("customScores", JSON.stringify(customScores))
    renderLeaderboard()

    // Show feedback to the user
    if (typeof showNotificationPopup === 'function') {
      showNotificationPopup(`Score saved! ${name}: ${totalPoints} points`);
    } else {
      alert(`Score saved! ${name}: ${totalPoints} points`);
    }
  }

  function renderLeaderboard() {
    const tbody = document.getElementById("leaderboardBody")
    tbody.innerHTML = ""

    const uniqueMap = new Map()
    customScores.forEach(({ name, points }) => {
      if (!uniqueMap.has(name) || uniqueMap.get(name) < points) {
        uniqueMap.set(name, points)
      }
    })

    const sorted = Array.from(uniqueMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)

    sorted.forEach(([name, points], i) => {
      let medal = ""
      if (i === 0) medal = "🥇"
      else if (i === 1) medal = "🥈"
      else if (i === 2) medal = "🥉"

      const row = document.createElement("tr")
      row.innerHTML = `
        <td>${medal || i + 1}</td>
        <td>${name}</td>
        <td>${points}</td>
      `
      tbody.appendChild(row)
    })
  }

  function loadDailyMissions() {
    const allDailyTasks = [
      "Clean your desk",
      "Organize your calendar",
      "Meditate for 5 minutes",
      "Message a loved one",
      "Limit social media to 30min",
      "Write down 3 goals",
      "Take a walk",
      "Wake up before 8 AM",
      "Go to bed early",
      "Plan tomorrow",
      "Declutter inbox",
      "Do 1 kind act",
      "Say a gratitude aloud",
    ]
    const container = document.getElementById("dailyMissions")
    container.innerHTML = ""

    const today = new Date().toISOString().slice(0, 10)
    let missions = JSON.parse(localStorage.getItem("dailyMissions")) || {}

    if (!missions.date || missions.date !== today) {
      const shuffled = allDailyTasks.sort(() => 0.5 - Math.random())
      missions = {
        date: today,
        tasks: shuffled.slice(0, 3),
      }
      completedMissions = []
      localStorage.setItem("dailyMissions", JSON.stringify(missions))
      localStorage.setItem("dailyMissionsDone", JSON.stringify(completedMissions))
      localStorage.removeItem("streakUpdatedDate")
      streakUpdatedToday = false
    }

    missions.tasks.forEach((task, index) => {
      const btn = document.createElement("button")
      btn.innerText = completedMissions.includes(index) ? "✅ " + task : task
      btn.disabled = completedMissions.includes(index)
      btn.style.padding = "10px 15px"
      btn.style.borderRadius = "8px"
      btn.style.border = "none"
      btn.style.cursor = "pointer"
      btn.style.fontWeight = "bold"
      btn.style.background = btn.disabled ? "#10b981" : "#f1c40f"
      btn.onclick = () => {
        if (!completedMissions.includes(index)) {
          totalPoints += 5
          updateScoreDisplay()
          completedMissions.push(index)
          localStorage.setItem("dailyMissionsDone", JSON.stringify(completedMissions))
          btn.innerText = "✅ " + task
          btn.style.background = "#10b981"
          btn.disabled = true
          celebrate()
          checkIfEverythingCompleted()
        }
      }
      container.appendChild(btn)
    })
  }

  function celebrate() {
    for (let i = 0; i < 60; i++) {
      const confetti = document.createElement("div")
      confetti.style.width = `${Math.random() * 6 + 4}px`
      confetti.style.height = `${Math.random() * 6 + 4}px`
      confetti.style.position = "fixed"
      confetti.style.top = `${Math.random() * 100}vh`
      confetti.style.left = `${Math.random() * 100}vw`
      confetti.style.background = `hsl(${Math.random() * 360}, 100%, 60%)`
      confetti.style.opacity = "0.9"
      confetti.style.zIndex = 9999
      confetti.style.borderRadius = "50%"
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`
      confetti.style.animation = "confettiFall 1s ease-out forwards"
      document.body.appendChild(confetti)
      setTimeout(() => confetti.remove(), 1000)
    }
  }

  // Add style for confetti animation if not already present
  if (!document.querySelector("style[data-confetti-style]")) {
    const style = document.createElement("style")
    style.setAttribute("data-confetti-style", "true")
    style.innerHTML = `
    @keyframes confettiFall {
      0% {
        transform: scale(0) translateY(-20px);
        opacity: 1;
      }
      100% {
        transform: scale(1.5) translateY(60px);
        opacity: 0;
      }
    }`
    document.head.appendChild(style)
  }

  function makeDraggable(el) {
    if (!el) return

    let posX = 0,
      posY = 0,
      mouseX = 0,
      mouseY = 0
    el.onmousedown = dragMouseDown

    function dragMouseDown(e) {
      e.preventDefault()
      mouseX = e.clientX
      mouseY = e.clientY
      document.onmouseup = stopDragging
      document.onmousemove = elementDrag
    }

    function elementDrag(e) {
      e.preventDefault()
      posX = mouseX - e.clientX
      posY = mouseY - e.clientY
      mouseX = e.clientX
      mouseY = e.clientY

      const minTop = 80
      const minLeft = 0
      const maxLeft = window.innerWidth - el.offsetWidth

      let newTop = el.offsetTop - posY
      let newLeft = el.offsetLeft - posX

      newTop = Math.max(minTop, newTop)
      newLeft = Math.min(Math.max(minLeft, newLeft), maxLeft)

      el.style.top = `${newTop}px`
      el.style.left = `${newLeft}px`
    }

    function stopDragging() {
      document.onmouseup = null
      document.onmousemove = null
    }
  }

  function superCelebrate() {
    document.getElementById("celebrationOverlay").style.display = "flex"

    for (let i = 0; i < 150; i++) {
      const confetti = document.createElement("div")
      confetti.style.width = `${Math.random() * 8 + 4}px`
      confetti.style.height = `${Math.random() * 8 + 4}px`
      confetti.style.position = "fixed"
      confetti.style.top = `${Math.random() * 100}vh`
      confetti.style.left = `${Math.random() * 100}vw`
      confetti.style.background = `hsl(${Math.random() * 360}, 100%, 60%)`
      confetti.style.opacity = "0.9"
      confetti.style.zIndex = 10000
      confetti.style.borderRadius = "50%"
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`
      confetti.style.animation = "confettiFall 1s ease-out forwards"
      document.body.appendChild(confetti)
      setTimeout(() => confetti.remove(), 1000)
    }

    if (!streakUpdatedToday) {
      streak++
      document.getElementById("streakCount").innerText = streak
      localStorage.setItem("streak", streak.toString())
      localStorage.setItem("streakUpdatedDate", new Date().toISOString().slice(0, 10))
      streakUpdatedToday = true
    }

    setTimeout(() => {
      document.getElementById("celebrationOverlay").style.display = "none"
    }, 5000)
  }

  function loadCompletedTasks() {
    const savedTasks = localStorage.getItem("completedTasks")
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks)
      Object.keys(parsedTasks).forEach((key) => {
        completedTasks.set(key, new Set(parsedTasks[key]))
      })
    }
  }
});