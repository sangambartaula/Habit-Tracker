const currentDate = new Date()
let selectedDate = null

function generateCalendar() {
  const calendar = document.getElementById("calendar")
  calendar.innerHTML = ""

  const monthYear = document.getElementById("monthYear")
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  monthYear.innerText = `${currentDate.toLocaleString("default", { month: "long" })} ${year}`

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  for (const day of days) {
    const dayElem = document.createElement("div")
    dayElem.className = "calendar-day"
    dayElem.innerText = day
    calendar.appendChild(dayElem)
  }

  const allReminders = getValidReminders()
  const habits = JSON.parse(localStorage.getItem("habits")) || []

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div")
    empty.className = "calendar-date"
    calendar.appendChild(empty)
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const dateElem = document.createElement("div")
    dateElem.className = "calendar-date"
    dateElem.innerHTML = `<div>${i}</div>`

    const monthStr = (month + 1).toString().padStart(2, "0")
    const dateStr = `${year}-${monthStr}-${i.toString().padStart(2, "0")}`

    // Check for habits and reminders on this date
    const habitsOnDate = habits.filter(habit => 
      isDateInRange(dateStr, habit.startDate, habit.endDate)
    )
    const remindersOnDate = allReminders.filter(reminder => 
      isDateInRange(dateStr, reminder.startDate, reminder.endDate)
    )

    if (habitsOnDate.length > 0 || remindersOnDate.length > 0) {
      const dot = document.createElement("div")
      dot.className = "reminder-dot"
      dateElem.appendChild(dot)

      // Add tooltip with habit and reminder information
      const tooltip = document.createElement("div")
      tooltip.className = "date-tooltip"
      tooltip.style.display = "none"
      tooltip.style.position = "absolute"
      tooltip.style.background = "#333"
      tooltip.style.color = "white"
      tooltip.style.padding = "10px"
      tooltip.style.borderRadius = "8px"
      tooltip.style.zIndex = "1000"
      tooltip.style.minWidth = "200px"
      tooltip.style.maxWidth = "300px"
      tooltip.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)"

      let tooltipContent = ""
      if (habitsOnDate.length > 0) {
        tooltipContent += "<strong>Habits:</strong><br>"
        habitsOnDate.forEach(habit => {
          tooltipContent += `• ${habit.name}<br>`
        })
      }
      if (remindersOnDate.length > 0) {
        tooltipContent += "<strong>Reminders:</strong><br>"
        remindersOnDate.forEach(reminder => {
          tooltipContent += `• ${reminder.habit} at ${reminder.time}<br>`
        })
      }

      tooltip.innerHTML = tooltipContent
      dateElem.appendChild(tooltip)

      // Show tooltip on hover
      dateElem.onmouseenter = () => {
        tooltip.style.display = "block"
        tooltip.style.top = "-10px"
        tooltip.style.left = "50%"
        tooltip.style.transform = "translate(-50%, -100%)"
      }
      dateElem.onmouseleave = () => {
        tooltip.style.display = "none"
      }
    }

    dateElem.onclick = () => {
      selectedDate = dateStr;
      loadReminders();
    }
    calendar.appendChild(dateElem)
  }
}

function hasReminderOnDate(dateStr, allReminders) {
  return allReminders.some((reminder) => {
    return isDateInRange(dateStr, reminder.startDate, reminder.endDate)
  })
}

function prevMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1)
  generateCalendar()
}

function nextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1)
  generateCalendar()
}

function handleHabitSelect() {
  const habitSelect = document.getElementById("habitInput")
  const timeInput = document.getElementById("timeInput")
  const frequencyInput = document.getElementById("frequencyInput")

  if (habitSelect.value) {
    timeInput.disabled = false
    frequencyInput.disabled = false
    
    // Add event listener to close time input dropdown when time is selected
    timeInput.addEventListener('change', function() {
      this.blur() // This will close the dropdown
    })
  } else {
    timeInput.disabled = true
    frequencyInput.disabled = true
  }
}

// Add new function to handle time input blur
function handleTimeInputBlur() {
  const timeInput = document.getElementById("timeInput")
  if (timeInput.value) {
    timeInput.blur()
  }
}

function closeModal() {
  document.getElementById("reminderModal").style.display = "none"
  clearForm()
  const modalContent = document.querySelector(".modal-content")
  modalContent.style.opacity = "1"
  modalContent.style.pointerEvents = "auto"
  
  // Remove time input blur event listener
  const timeInput = document.getElementById("timeInput")
  timeInput.removeEventListener("blur", handleTimeInputBlur)
}

function clearForm() {
  document.getElementById("habitInput").value = ""
  document.getElementById("timeInput").value = ""
  document.getElementById("frequencyInput").value = ""
  document.getElementById("timeInput").disabled = true
  document.getElementById("frequencyInput").disabled = true
}

function populateHabitOptions(dateStr) {
  const habitSelect = document.getElementById("habitInput")
  habitSelect.innerHTML = '<option value="">Select a Habit</option>'

  const habits = JSON.parse(localStorage.getItem("habits")) || []
  const validHabits = habits.filter(habit => isDateInRange(dateStr, habit.startDate, habit.endDate))

  validHabits.forEach(habit => {
    const option = document.createElement("option")
    option.value = habit.name
    option.text = habit.name
    habitSelect.appendChild(option)
  })
}

function saveReminder() {
  const habitName = document.getElementById("habitInput").value
  const time = document.getElementById("timeInput").value
  const frequency = document.getElementById("frequencyInput").value

  if (!habitName || !time || !frequency) {
    showMessage("Please fill all fields.")
    return
  }

  const allHabits = JSON.parse(localStorage.getItem("habits")) || []
  const selectedHabit = allHabits.find((h) => h.name === habitName)

  if (!selectedHabit) {
    showMessage("Habit not found!")
    return
  }

  // Validate that the selected date is within the habit's date range
  if (!isDateInRange(selectedDate, selectedHabit.startDate, selectedHabit.endDate)) {
    showMessage("Cannot set reminder for this date. The habit is not active on this date.")
    return
  }

  const newReminder = {
    habit: habitName,
    time: time,
    frequency: frequency,
    startDate: selectedDate,
    endDate: selectedHabit.endDate
  }

  const allReminders = JSON.parse(localStorage.getItem("reminders")) || []
  allReminders.push(newReminder)
  localStorage.setItem("reminders", JSON.stringify(allReminders))

  showMessage("Reminder set successfully!")
  closeModal()
  loadReminders()
  generateCalendar()
}

function loadReminders() {
  const list = document.getElementById("reminderList")
  const reminderSection = document.querySelector(".reminder-list")
  const dateDisplay = document.getElementById("selectedDateDisplay")
  
  // Clear previous reminders
  list.innerHTML = ""
  
  if (!selectedDate) {
    reminderSection.style.display = "none"
    return
  }

  const allReminders = getValidReminders()
  const habits = JSON.parse(localStorage.getItem("habits")) || []

  const remindersForSelectedDate = allReminders
    .map((reminder, index) => ({ ...reminder, index }))
    .filter((reminder) => isDateInRange(selectedDate, reminder.startDate, reminder.endDate))

  const habitsForSelectedDate = habits
    .filter((habit) => isDateInRange(selectedDate, habit.startDate, habit.endDate))

  // Format the selected date - Add UTC to prevent timezone offset
  const formattedDate = new Date(selectedDate + 'T00:00:00Z').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  })
  dateDisplay.innerText = formattedDate

  reminderSection.style.display = "block"

  // Check if there are any habits set up at all
  if (habits.length === 0) {
    const noHabitsMessage = document.createElement("div")
    noHabitsMessage.className = "no-habits-message"
    noHabitsMessage.innerHTML = `
      <div class="message-container">
        <span class="message-icon">⚠️</span>
        <p class="message-text">No habits found. Please add a habit first!</p>
      </div>
    `
    list.appendChild(noHabitsMessage)
    return
  }

  // Display message when no habits are available for the selected date
  if (habitsForSelectedDate.length === 0) {
    const noHabitsMessage = document.createElement("div")
    noHabitsMessage.className = "no-habits-message"
    noHabitsMessage.innerHTML = `
      <div class="message-container">
        <span class="message-icon">📝</span>
        <p class="message-text">No habits available for this date</p>
      </div>
    `
    list.appendChild(noHabitsMessage)
    return
  }

  // Add habits section with available habits to set reminders
  const habitsHeader = document.createElement("div")
  habitsHeader.className = "section-header"
  habitsHeader.innerHTML = `<span>📋 Available Habits</span>`
  list.appendChild(habitsHeader)

  habitsForSelectedDate.forEach((habit) => {
    const item = document.createElement("li")
    item.className = "reminder-item clickable"
    item.innerHTML = `
      <div class="reminder-content">
        <div class="reminder-title">📝 ${habit.name}</div>
        <div class="reminder-meta">
          <span class="date-range">📅 ${new Date(habit.startDate).toLocaleDateString()} - ${new Date(habit.endDate).toLocaleDateString()}</span>
        </div>
      </div>
      <button class="add-reminder-btn small" onclick="openModalForHabit('${habit.name}', '${selectedDate}')">
        <span>➕</span> Add Reminder
      </button>
    `
    list.appendChild(item)
  })

  // Add existing reminders section if there are any
  if (remindersForSelectedDate.length > 0) {
    const remindersHeader = document.createElement("div")
    remindersHeader.className = "section-header"
    remindersHeader.innerHTML = `<span>🔔 Scheduled Reminders</span>`
    list.appendChild(remindersHeader)

    // Sort reminders by time
    remindersForSelectedDate.sort((a, b) => a.time.localeCompare(b.time))

    remindersForSelectedDate.forEach((reminder) => {
      const item = document.createElement("li")
      item.className = "reminder-item"
      
      // Format the time
      const timeDisplay = new Date(`2000-01-01T${reminder.time}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
      
      item.innerHTML = `
        <div class="reminder-content">
          <div class="reminder-title">📝 ${reminder.habit}</div>
          <div class="reminder-meta">
            <span class="time">⏰ ${timeDisplay}</span>
            <span class="frequency">🔄 ${reminder.frequency.charAt(0).toUpperCase() + reminder.frequency.slice(1)}</span>
          </div>
        </div>
        <button class="delete-btn" onclick="deleteReminder(${reminder.index})" title="Delete Reminder">🗑️</button>
      `
      list.appendChild(item)
    })
  }
}

function deleteReminder(index) {
  const allReminders = JSON.parse(localStorage.getItem("reminders")) || []

  if (index >= 0 && index < allReminders.length) {
    const deletedReminder = allReminders[index]
    allReminders.splice(index, 1)
    localStorage.setItem("reminders", JSON.stringify(allReminders))
    
    // Format time to 12-hour format
    const [hours, minutes] = deletedReminder.time.split(':')
    const time = new Date()
    time.setHours(parseInt(hours))
    time.setMinutes(parseInt(minutes))
    const formattedTime = time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    
    // Show notification for deleted reminder
    if (typeof showNotificationPopup === 'function') {
      showNotificationPopup(`Reminder deleted: ${deletedReminder.habit} at ${formattedTime}`)
    }
    
    loadReminders()
    generateCalendar()
  }
}

function isDateInRange(dateStr, startDate, endDate) {
  const date = new Date(dateStr)
  return date >= new Date(startDate) && date <= new Date(endDate)
}

function getValidReminders() {
  let allReminders = JSON.parse(localStorage.getItem("reminders")) || []
  const habits = JSON.parse(localStorage.getItem("habits")) || []
  const validHabitNames = habits.map((h) => h.name)

  allReminders = allReminders.filter((reminder) => validHabitNames.includes(reminder.habit))
  localStorage.setItem("reminders", JSON.stringify(allReminders))
  return allReminders
}

// FINAL - UPDATED ONLOAD: 
window.onload = () => {
  console.log("Remainder page loaded - generating calendar");

  setTimeout(() => {
    generateCalendar();

    const calendarContainer = document.querySelector(".calendar-container");
    if (calendarContainer) {
      calendarContainer.style.display = "block";
    }

    const calendar = document.getElementById("calendar");
    if (calendar && calendar.children.length === 0) {
      console.log("Calendar not populated - trying again");
      setTimeout(generateCalendar, 100);
    }
  }, 100);
}

function showMessage(text) {
  const messageBox = document.createElement("div")
  messageBox.className = "message-box"
  messageBox.style.position = "fixed"
  messageBox.style.top = "20px"
  messageBox.style.left = "50%"
  messageBox.style.transform = "translateX(-50%)"
  messageBox.style.padding = "15px 25px"
  messageBox.style.background = "rgba(52, 152, 219, 0.9)"
  messageBox.style.color = "white"
  messageBox.style.borderRadius = "8px"
  messageBox.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)"
  messageBox.style.zIndex = "1000"
  messageBox.style.transition = "all 0.3s ease"
  messageBox.innerText = text

  document.body.appendChild(messageBox)

  setTimeout(() => {
    messageBox.style.opacity = "0"
    messageBox.style.transform = "translate(-50%, -20px)"
    setTimeout(() => {
      messageBox.remove()
    }, 300)
  }, 3000)
}

function openModalForHabit(habitName, dateStr) {
  const habits = JSON.parse(localStorage.getItem("habits")) || []
  const validHabits = habits.filter(habit => isDateInRange(dateStr, habit.startDate, habit.endDate))
  
  // Don't open modal if no habits are available
  if (validHabits.length === 0) {
    return
  }
  
  selectedDate = dateStr
  document.getElementById("reminderModal").style.display = "flex"
  
  // Populate habit options first
  populateHabitOptions(dateStr)
  
  // Only try to select the habit if it exists in the options
  const habitSelect = document.getElementById("habitInput")
  const habitExists = Array.from(habitSelect.options).some(option => option.value === habitName)
  
  if (habitExists) {
    habitSelect.value = habitName
    // Enable the time and frequency inputs
    document.getElementById("timeInput").disabled = false
    document.getElementById("frequencyInput").disabled = false
  }
}
