document.addEventListener("DOMContentLoaded", () => {
  const habitForm = document.getElementById("habitForm");
  const habitContainer = document.getElementById("habitContainer");
  
  // Track which habits have been completed today to prevent double counting
  let completedToday = new Set();
  
  const loadHabits = () => {
    const habits = JSON.parse(localStorage.getItem("habits")) || [];
    habitContainer.innerHTML = "";
    
    // Reset the completed set when reloading habits
    completedToday = new Set();
    
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];
    
    // Check which habits were completed today
    habits.forEach(habit => {
      if (habit.completedDates && habit.completedDates.includes(today)) {
        completedToday.add(habit.name);
      }
    });
    
    habits.forEach(renderHabit);
    updateDashboard();
  };

  const saveHabit = (habit) => {
    const habits = JSON.parse(localStorage.getItem("habits")) || [];
    
    // Check if a habit with this name already exists
    const existingHabitIndex = habits.findIndex(h => h.name === habit.name);
    
    if (existingHabitIndex !== -1) {
      // Show error message
      if (typeof showNotificationPopup === 'function') {
        showNotificationPopup(`A habit named "${habit.name}" already exists. Please use a different name.`, true);
      } else {
        alert(`A habit named "${habit.name}" already exists. Please use a different name.`);
      }
      return false; // Indicate save failed
    }
    
    habits.push(habit);
    localStorage.setItem("habits", JSON.stringify(habits));
    return true; // Indicate save succeeded
  };

  const updateStreak = (habitName) => {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];
    
    // If already completed today, don't update streak again
    if (completedToday.has(habitName)) {
      console.log(`Habit "${habitName}" already completed today. Not updating streak.`);
      return;
    }
    
    let habits = JSON.parse(localStorage.getItem("habits")) || [];
    habits = habits.map((h) => {
      if (h.name === habitName) {
        // Increment streak by exactly 1
        h.streak = (h.streak || 0) + 1;
        
        // Initialize completedDates array if it doesn't exist
        if (!h.completedDates) h.completedDates = [];
        
        // Add today's date if not already added
        if (!h.completedDates.includes(today)) {
          h.completedDates.push(today);
        }
        
        // Mark as completed today
        completedToday.add(habitName);
      }
      return h;
    });
    
    localStorage.setItem("habits", JSON.stringify(habits));
    updateDashboard();
    loadHabits();
  };

  const deleteHabit = (name) => {
    // Delete the habit
    let habits = JSON.parse(localStorage.getItem("habits")) || [];
    habits = habits.filter((h) => h.name !== name);
    localStorage.setItem("habits", JSON.stringify(habits));

    // Delete associated reminders
    let reminders = JSON.parse(localStorage.getItem("reminders")) || [];
    reminders = reminders.filter((r) => r.habit !== name);
    localStorage.setItem("reminders", JSON.stringify(reminders));

    // Remove from completed set
    completedToday.delete(name);
    
    loadHabits();
    updateDashboard();

    // Show success message
    if (typeof showNotificationPopup === 'function') {
      showNotificationPopup(`Habit "${name}" and its reminders have been deleted.`);
    } else {
      alert(`Habit "${name}" and its reminders have been deleted.`);
    }
  };

  const renderHabit = (habit) => {
    const li = document.createElement("li");
    
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];
    
    // Check if this habit was completed today
    const isCompletedToday = completedToday.has(habit.name);
    
    li.innerHTML = `
      <strong>${habit.name}</strong><br>
      ⏳ ${habit.startDate} → ${habit.endDate}<br>
      🔥 Streak: ${habit.streak || 0} days
      <br>
      <label>
        <input type="checkbox" class="done" data-name="${habit.name}" ${isCompletedToday ? 'checked disabled' : ''}> 
        Mark as Done ${isCompletedToday ? '✅ (Completed today)' : '✅'}
      </label>
      <button class="edit-btn" onclick="editHabit('${habit.name}')">✏️ Edit</button>
      <button class="delete-btn" onclick="deleteHabit('${habit.name}')">🗑️ Delete</button>
      <hr>
    `;

    const checkbox = li.querySelector("input.done");
    
    // Only add event listener if not already completed today
    if (!isCompletedToday) {
      checkbox.addEventListener("change", (event) => {
        if (event.target.checked) {
          const name = event.target.getAttribute("data-name");
          updateStreak(name);
          
          // Disable checkbox after clicking to prevent multiple clicks
          event.target.disabled = true;
        }
      });
    }

    habitContainer.appendChild(li);
  };

  const updateDashboard = () => {
    const habits = JSON.parse(localStorage.getItem("habits")) || [];
    let totalStreak = 0;
    let habitsDone = 0;

    habits.forEach((h) => {
      if (h.streak > 0) {
        habitsDone += 1;
        totalStreak += h.streak;
      }
    });

    localStorage.setItem("dashboardStats", JSON.stringify({ streak: totalStreak, habitsDone: habitsDone }));
    localStorage.setItem("streak", totalStreak);
    const totalPoints = totalStreak * 10;
    localStorage.setItem("totalPoints", totalPoints);
  };

  if (habitForm) {
    habitForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const habit = {
        name: document.getElementById("name").value,
        startDate: document.getElementById("startDate").value,
        endDate: document.getElementById("endDate").value,
        streak: 0,
        completedDates: [],
      };

      // Only proceed if save was successful
      if (saveHabit(habit)) {
        habitForm.reset();
        loadHabits();

        if (typeof showNotificationPopup === 'function') {
          showNotificationPopup("Habit saved! Now set a reminder for it ✨");
        } else {
          alert("Habit saved! Now set a reminder for it ✨");
        }
        
        // Uncomment this if you want to redirect
        // window.location.href = "Remainder.html";
      }
    });
  }

  window.editHabit = (name) => {
    const habits = JSON.parse(localStorage.getItem("habits")) || [];
    const habit = habits.find((h) => h.name === name);
    if (habit) {
      document.getElementById("name").value = habit.name;
      document.getElementById("startDate").value = habit.startDate;
      document.getElementById("endDate").value = habit.endDate;
      deleteHabit(name);
    }
  };

  window.deleteHabit = deleteHabit;
  
  // Function to remove duplicate habits
  window.removeDuplicateHabits = () => {
    const habits = JSON.parse(localStorage.getItem("habits")) || [];
    const uniqueHabits = [];
    const habitNames = new Set();
    
    // Keep only the first occurrence of each habit name
    habits.forEach(habit => {
      if (!habitNames.has(habit.name)) {
        habitNames.add(habit.name);
        uniqueHabits.push(habit);
      }
    });
    
    localStorage.setItem("habits", JSON.stringify(uniqueHabits));
    loadHabits();
    
    if (typeof showNotificationPopup === 'function') {
      showNotificationPopup(`Removed ${habits.length - uniqueHabits.length} duplicate habits.`);
    } else {
      alert(`Removed ${habits.length - uniqueHabits.length} duplicate habits.`);
    }
  };

  // Add a function to clear completed status (useful for testing)
  window.clearCompletedStatus = () => {
    completedToday.clear();
    
    // Also clear completed status in localStorage
    const habits = JSON.parse(localStorage.getItem("habits")) || [];
    const today = new Date().toISOString().split("T")[0];
    
    habits.forEach(habit => {
      if (habit.completedDates) {
        habit.completedDates = habit.completedDates.filter(date => date !== today);
      }
    });
    
    localStorage.setItem("habits", JSON.stringify(habits));
    loadHabits();
    
    console.log("Cleared all completed statuses for today");
    
    if (typeof showNotificationPopup === 'function') {
      showNotificationPopup("Cleared all completed statuses for today. You can mark habits as done again.");
    } else {
      alert("Cleared all completed statuses for today. You can mark habits as done again.");
    }
  };

  // Add a button to clean up duplicates
  const addCleanupButton = () => {
    const cleanupButton = document.createElement("button");
    cleanupButton.textContent = "🧹 Clean Up Duplicate Habits";
    cleanupButton.className = "cleanup-btn";
    cleanupButton.style.marginTop = "20px";
    cleanupButton.style.padding = "10px 15px";
    cleanupButton.style.backgroundColor = "#6d28d9";
    cleanupButton.style.color = "white";
    cleanupButton.style.border = "none";
    cleanupButton.style.borderRadius = "8px";
    cleanupButton.style.cursor = "pointer";
    cleanupButton.style.display = "block";
    cleanupButton.style.width = "100%";
    
    cleanupButton.addEventListener("click", window.removeDuplicateHabits);
    
    const habitListSection = document.querySelector(".habit-list");
    if (habitListSection) {
      habitListSection.appendChild(cleanupButton);
    }
    
    // Also add a reset button for testing
    const resetButton = document.createElement("button");
    resetButton.textContent = "🔄 Reset Today's Completions";
    resetButton.className = "reset-btn";
    resetButton.style.marginTop = "10px";
    resetButton.style.padding = "10px 15px";
    resetButton.style.backgroundColor = "#4b5563";
    resetButton.style.color = "white";
    resetButton.style.border = "none";
    resetButton.style.borderRadius = "8px";
    resetButton.style.cursor = "pointer";
    resetButton.style.display = "block";
    resetButton.style.width = "100%";
    
    resetButton.addEventListener("click", window.clearCompletedStatus);
    
    if (habitListSection) {
      habitListSection.appendChild(resetButton);
    }
  };

  loadHabits();
  addCleanupButton();
});