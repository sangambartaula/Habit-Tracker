;(() => {
  console.log("📢 Enhanced notification system initializing...")

  // Prevent multiple initializations
  if (window.enhancedNotificationSystemActive) {
    console.log("📢 Enhanced notification system already active")
    return
  }

  // Mark as initialized
  window.enhancedNotificationSystemActive = true
  window.lastReminderCheck = Date.now()

  // ===== NOTIFICATION DISPLAY FUNCTIONS =====

  // Show notification popup
  function showNotificationPopup(message, isError = false) {
    console.log("📢 Showing notification:", message)

    // Create notification element
    const popup = document.createElement("div")
    popup.className = "notification-popup"

    // Set styles
    Object.assign(popup.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      background: isError ? "linear-gradient(135deg, #ff4b2b, #ff416c)" : "linear-gradient(135deg, #6d28d9, #8b5cf6)",
      color: "white",
      padding: "15px 20px",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      zIndex: "9999",
      fontWeight: "500",
      minWidth: "250px",
      transform: "translateX(100%)",
      opacity: "0",
      transition: "all 0.3s ease",
      display: "flex",
      flexDirection: "column",
      gap: "8px"
    })

    // Create header with close button
    const header = document.createElement("div")
    Object.assign(header.style, {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
      paddingBottom: "8px",
      marginBottom: "8px"
    })

    const title = document.createElement("span")
    title.innerHTML = isError ? "⚠️ Error" : "🔔 Notification"
    title.style.fontWeight = "bold"

    const closeBtn = document.createElement("span")
    closeBtn.innerHTML = "×"
    Object.assign(closeBtn.style, {
      cursor: "pointer",
      fontSize: "22px",
      lineHeight: "22px",
      width: "22px",
      height: "22px",
      textAlign: "center",
      transition: "all 0.3s ease"
    })

    closeBtn.onclick = () => {
      popup.style.opacity = "0"
      popup.style.transform = "translateX(100%)"
      setTimeout(() => popup.remove(), 300)
    }

    header.appendChild(title)
    header.appendChild(closeBtn)

    // Create content
    const content = document.createElement("div")
    content.textContent = message
    content.style.fontSize = "14px"

    // Create timestamp
    const timestamp = document.createElement("div")
    timestamp.style.fontSize = "12px"
    timestamp.style.color = "rgba(255,255,255,0.7)"
    timestamp.textContent = new Date().toLocaleTimeString()

    // Assemble popup
    popup.appendChild(header)
    popup.appendChild(content)
    popup.appendChild(timestamp)

    // Add to notification container
    let container = document.getElementById("notificationContainer")
    if (!container) {
      // Create container if it doesn't exist
      container = document.createElement("div")
      container.id = "notificationContainer"
      Object.assign(container.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: "9999",
        display: "flex",
        flexDirection: "column",
        gap: "10px"
      })
      document.body.appendChild(container)
    }
    container.appendChild(popup)

    // Trigger animation
    setTimeout(() => {
      popup.style.transform = "translateX(0)"
      popup.style.opacity = "1"
    }, 10)

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      popup.style.opacity = "0"
      popup.style.transform = "translateX(100%)"
      setTimeout(() => popup.remove(), 300)
    }, 5000)
  }

  // ===== REMINDER CHECKING FUNCTIONS =====

  // Get valid reminders from localStorage
  function getValidReminders() {
    try {
      let allReminders = JSON.parse(localStorage.getItem("reminders")) || []
      const habits = JSON.parse(localStorage.getItem("habits")) || []
      const validHabitNames = habits.map((h) => h.name)

      // Filter to only valid reminders
      allReminders = allReminders.filter((reminder) => validHabitNames.includes(reminder.habit))

      return allReminders
    } catch (error) {
      console.error("📢 Error getting reminders:", error)
      return []
    }
  }

  // Check if a date is within a range
  function isDateInRange(dateStr, startDate, endDate) {
    try {
      const date = new Date(dateStr)
      return date >= new Date(startDate) && date <= new Date(endDate)
    } catch (error) {
      console.error("📢 Error checking date range:", error)
      return false
    }
  }

  // Check reminders against current time
  function checkReminders() {
    try {
      console.log("📢 Checking reminders at:", new Date().toLocaleTimeString())

      const allReminders = getValidReminders()
      console.log("📢 Found reminders:", allReminders.length)

      if (allReminders.length === 0) {
        return
      }

      const now = new Date()
      const todayStr = now.toISOString().split("T")[0] // YYYY-MM-DD

      // Format current time as HH:MM
      const currentHour = now.getHours().toString().padStart(2, "0")
      const currentMinute = now.getMinutes().toString().padStart(2, "0")
      const currentTimeStr = `${currentHour}:${currentMinute}`

      console.log("📢 Current time:", currentTimeStr)

      // Check each reminder
      allReminders.forEach((reminder) => {
        if (isDateInRange(todayStr, reminder.startDate, reminder.endDate)) {
          console.log("📢 Checking reminder:", reminder.habit, "at time:", reminder.time)

          // Check if the current time matches the reminder time
          if (reminder.time === currentTimeStr) {
            console.log("📢 Time match found!")
            showNotificationPopup(`It's time for: ${reminder.habit} (${reminder.frequency})`)
          }
        }
      })

      // Update last check time
      window.lastReminderCheck = Date.now()
    } catch (error) {
      console.error("📢 Error checking reminders:", error)
    }
  }

  // Check for reminders that might have been missed
  function checkMissedReminders() {
    try {
      console.log("📢 Checking for missed reminders")

      const now = Date.now()
      const timeSinceLastCheck = now - window.lastReminderCheck

      // Only check if it's been more than 1 minute since last check
      if (timeSinceLastCheck < 60000) {
        return
      }

      const allReminders = getValidReminders()
      if (allReminders.length === 0) {
        return
      }

      const currentDate = new Date()
      const todayStr = currentDate.toISOString().split("T")[0]
      const currentHour = currentDate.getHours()
      const currentMinute = currentDate.getMinutes()
      const currentTimeInMinutes = currentHour * 60 + currentMinute

      // Check each reminder
      allReminders.forEach((reminder) => {
        if (isDateInRange(todayStr, reminder.startDate, reminder.endDate)) {
          const [reminderHour, reminderMinute] = reminder.time.split(":").map(Number)
          const reminderTimeInMinutes = reminderHour * 60 + reminderMinute

          // If reminder was due in the last hour
          const timeDiff = currentTimeInMinutes - reminderTimeInMinutes
          if (timeDiff > 0 && timeDiff <= 60) {
            showNotificationPopup(
              `Reminder: ${reminder.habit} (${reminder.frequency}) - This was due ${timeDiff} minutes ago`,
            )
          }
        }
      })

      // Update last check time
      window.lastReminderCheck = now
    } catch (error) {
      console.error("📢 Error checking missed reminders:", error)
    }
  }

  // ===== DEBUGGING FUNCTIONS =====

  // Add a test button (for debugging)
  function addTestButton() {
    try {
      // Only add in debug mode
      if (localStorage.getItem("debugMode") !== "true") {
        return
      }

      // Check if button already exists
      if (document.getElementById("testNotificationBtn")) {
        return
      }

      const button = document.createElement("button")
      button.id = "testNotificationBtn"
      button.textContent = "Test Notification"

      Object.assign(button.style, {
        position: "fixed",
        bottom: "10px",
        left: "10px",
        zIndex: "9998",
        padding: "8px 12px",
        background: "#f1c40f",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontWeight: "bold",
      })

      button.onclick = () => {
        showNotificationPopup("This is a test notification!")
      }

      document.body.appendChild(button)
      console.log("📢 Test button added")
    } catch (error) {
      console.error("📢 Error adding test button:", error)
    }
  }

  // ===== INITIALIZATION =====

  // Start the notification system
  function startNotificationSystem() {
    try {
      console.log("📢 Starting enhanced notification system")

      // Check immediately
      checkReminders()
      checkMissedReminders()

      // Set up interval to check every minute
      if (window.reminderCheckInterval) {
        clearInterval(window.reminderCheckInterval)
      }
      window.reminderCheckInterval = setInterval(checkReminders, 60000)

      // Add test button
      addTestButton()

      // Handle page visibility changes
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
          console.log("📢 Page became visible, checking reminders")
          checkMissedReminders()
          checkReminders()
        }
      })

      console.log("📢 Enhanced notification system started successfully")
    } catch (error) {
      console.error("📢 Error starting notification system:", error)
    }
  }

  // ===== MAKE FUNCTIONS GLOBALLY AVAILABLE =====

  // Make functions available globally (for backward compatibility)
  window.showNotificationPopup = showNotificationPopup
  window.checkReminders = checkReminders
  window.checkMissedReminders = checkMissedReminders
  window.getValidReminders = getValidReminders
  window.isDateInRange = isDateInRange

  // ===== START THE SYSTEM =====

  // Function to display upcoming reminders on the home page
  function displayUpcomingReminders() {
      try {
          const remindersList = document.getElementById('remindersList');
          if (!remindersList) return;

          const allReminders = getValidReminders();
          if (allReminders.length === 0) {
              remindersList.innerHTML = '<div class="reminder-item">No upcoming reminders</div>';
              return;
          }

          const now = new Date();
          const todayStr = now.toISOString().split('T')[0];

          // Sort reminders by date and time
          const sortedReminders = allReminders.sort((a, b) => {
              const dateA = new Date(a.startDate);
              const dateB = new Date(b.startDate);
              if (dateA.getTime() !== dateB.getTime()) {
                  return dateA.getTime() - dateB.getTime();
              }
              return a.time.localeCompare(b.time);
          });

          // Display upcoming reminders
          remindersList.innerHTML = sortedReminders.map(reminder => {
              const isToday = reminder.startDate === todayStr;
              const dateDisplay = isToday ? 'Today' : new Date(reminder.startDate).toLocaleDateString();
              
              // Format time in 12-hour format
              const timeDisplay = new Date(`2000-01-01T${reminder.time}`).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
              });
              
              return `
                  <div class="reminder-item">
                      <div class="reminder-info">
                          <div class="reminder-habit">${reminder.habit}</div>
                          <div class="reminder-time">${timeDisplay}</div>
                      </div>
                      <div class="reminder-date">${dateDisplay}</div>
                  </div>
              `;
          }).join('');
      } catch (error) {
          console.error('Error displaying upcoming reminders:', error);
      }
  }

  // Function to initialize the notification system
  function initializeNotificationSystem() {
      // Create notification container if it doesn't exist
      let container = document.getElementById("notificationContainer")
      if (!container) {
          container = document.createElement("div")
          container.id = "notificationContainer"
          Object.assign(container.style, {
              position: "fixed",
              bottom: "20px",
              right: "20px",
              zIndex: "9999",
              display: "flex",
              flexDirection: "column",
              gap: "10px"
          })
          document.body.appendChild(container)
      }

      // Start the notification system
      startNotificationSystem()

      // If we're on the home page, display the list view
      if (window.location.pathname.endsWith('index.html')) {
          displayUpcomingReminders()
          // Update the list every minute
          setInterval(displayUpcomingReminders, 60000)
      }
  }

  // Start immediately if document is already loaded
  if (document.readyState === "complete" || document.readyState === "interactive") {
    initializeNotificationSystem()
  } else {
    // Otherwise wait for DOMContentLoaded
    document.addEventListener("DOMContentLoaded", initializeNotificationSystem)
  }

  // Also start on window load (as a fallback)
  window.addEventListener("load", () => {
    if (!window.reminderCheckInterval) {
      console.log("📢 Window load event - starting system again")
      initializeNotificationSystem()
    }
  })

  console.log("📢 Enhanced notification system loaded successfully")
})()
