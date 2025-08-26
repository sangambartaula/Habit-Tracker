document.addEventListener("DOMContentLoaded", () => {
    console.log("Progress page loaded");
    
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
    
    // Load data from localStorage
    const habits = loadHabits();
    const customScores = JSON.parse(localStorage.getItem("customScores")) || [];
    const bestScore = parseInt(localStorage.getItem("bestScore")) || 0;
    const totalPoints = parseInt(localStorage.getItem("totalPoints")) || 0;
    const streak = parseInt(localStorage.getItem("streak")) || 0;
  
    console.log("Loaded habits:", habits);
    console.log("Loaded scores:", { customScores, bestScore, totalPoints, streak });
  
    // Update scores in the header
    document.getElementById("currentScore").textContent = bestScore;
    document.getElementById("totalScore").textContent = totalPoints;
  
    // Get all data for progress tracking
    const allData = getAllData();
    console.log("All data for progress:", allData);
  
    // Initial display with all data
    updateStatistics(allData);
    createProgressChart(allData);
    displayProgressItems(allData);
  
    // Set up event listeners
    setupEventListeners();
  });
  
  // Function to load habits from localStorage
  function loadHabits() {
    const habitData = localStorage.getItem("habits");
    console.log("Raw habit data:", habitData);
  
    if (!habitData) return [];
  
    try {
      const habits = JSON.parse(habitData);
  
      // Add category if missing
      return habits.map(habit => {
        if (!habit.category) {
          habit.category = "Goal and Timeline";
        }
        return habit;
      });
    } catch (error) {
      console.error("Error parsing habits:", error);
      return [];
    }
  }
  
  // Function to get all data from different sources
  function getAllData() {
    // Load habits
    const habits = loadHabits();
  
    // Load gamified experience data
    const customScores = JSON.parse(localStorage.getItem("customScores")) || [];
    const totalPoints = parseInt(localStorage.getItem("totalPoints")) || 0;
    const streak = parseInt(localStorage.getItem("streak")) || 0;
  
    // Load mini games data
    const bestScore = parseInt(localStorage.getItem("bestScore")) || 0;
  
    // Format habit data for progress display
    const habitItems = habits.map(habit => {
      const progress = calculateProgress(habit);
      return {
        title: habit.name,
        category: "Goal and Timeline",
        progress: progress
      };
    });
  
    // Add gamified experience data
    const gamifiedItems = [];
  
    // Add custom scores if available
    if (customScores.length > 0) {
      customScores.forEach(score => {
        gamifiedItems.push({
          title: `${score.name}'s Gamified Score`,
          category: "Gamified Experience",
          progress: Math.min(100, Math.round((score.points / 500) * 100))
        });
      });
    }
  
    // Add streak data
    if (streak > 0) {
      gamifiedItems.push({
        title: "🔥 Streak Progress",
        category: "Gamified Experience",
        progress: Math.min(100, streak * 5) // 5% per streak day, max 100%
      });
    }
  
    // Add total points data
    if (totalPoints > 0) {
      gamifiedItems.push({
        title: "💯 Total Points",
        category: "Gamified Experience",
        progress: Math.min(100, Math.round((totalPoints / 500) * 100))
      });
    }
  
    // Add mini games data
    const gameItems = [];
  
    if (bestScore > 0) {
      gameItems.push({
        title: "🎮 Mini Games Total Score",
        category: "Mini Games",
        progress: Math.min(100, Math.round((bestScore / 1000) * 100))
      });
  
      // Add individual mini games with estimated scores
      const miniGames = [
        { title: "🚴 Bike Road Challenge", score: Math.floor(bestScore * 0.2) },
        { title: "🎯 Aim Trainer", score: Math.floor(bestScore * 0.15) },
        { title: "💡 Memory Match", score: Math.floor(bestScore * 0.25) },
        { title: "🚗 Car Avoidance", score: Math.floor(bestScore * 0.2) },
        { title: "🌟 Star Catcher", score: Math.floor(bestScore * 0.2) }
      ];
  
      miniGames.forEach(game => {
        gameItems.push({
          title: game.title,
          category: "Mini Games",
          progress: Math.min(100, Math.round((game.score / 200) * 100))
        });
      });
    }
  
    // Combine all data
    return [...habitItems, ...gamifiedItems, ...gameItems];
  }
  
  // Calculate progress for habits
  function calculateProgress(habit) {
    if (habit.startDate && habit.endDate) {
      const start = new Date(habit.startDate);
      const end = new Date(habit.endDate);
      const today = new Date();
  
      // If habit has completedDates, use that for progress calculation
      if (habit.completedDates && habit.completedDates.length > 0) {
        const totalDays = Math.ceil((end - start) / 86400000) + 1;
        return Math.min(100, Math.round((habit.completedDates.length / totalDays) * 100));
      }
  
      // Otherwise calculate based on time passed
      const totalDays = Math.ceil((end - start) / 86400000) + 1;
      const passedDays = Math.ceil((today - start) / 86400000);
      return Math.min(100, Math.max(0, Math.round((passedDays / totalDays) * 100)));
    }
  
    // Default progress
    return 0;
  }
  
  // Function to update statistics
  function updateStatistics(data) {
    // Count items by category
    const categories = {};
    data.forEach(item => {
      if (!categories[item.category]) {
        categories[item.category] = 0;
      }
      categories[item.category]++;
    });
  
    const totalItems = data.length;
    const completed = data.filter(item => item.progress === 100).length;
    const active = totalItems - completed;
  
    // Update statistics in the UI
    document.getElementById("totalItems").textContent = totalItems;
    document.getElementById("activeItems").textContent = active;
    document.getElementById("completedItems").textContent = completed;
    
    // Update Mini Games count
    const miniGamesCount = categories["Mini Games"] || 0;
    document.getElementById("miniGamesCount").textContent = miniGamesCount;
  
    // Update category label if filtering
    const categoryLabel = document.getElementById("categoryLabel");
    if (categoryLabel) {
      const selectedCategory = document.getElementById("categoryFilter").value;
      categoryLabel.textContent = selectedCategory === "All" ? "All Categories" : selectedCategory;
    }
  }
  
  // Function to create progress chart
  function createProgressChart(data) {
    // Remove any existing chart
    const chartContainer = document.querySelector(".chart-container");
    if (!chartContainer) return;
  
    // Clear previous chart
    chartContainer.innerHTML = "";
  
    if (data.length === 0) {
      chartContainer.innerHTML = '<div style="text-align: center; padding: 50px 0; color: #a855f7;">No progress data available for this category.</div>';
      return;
    }
  
    // Create new canvas
    const canvas = document.createElement("canvas");
    canvas.id = "progressChart";
    chartContainer.appendChild(canvas);
  
    const ctx = canvas.getContext("2d");
  
    // Extract data for chart
    const labels = data.map(item => item.title);
    const progressValues = data.map(item => item.progress);
  
    // Create gradient for chart
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, "rgba(168, 85, 247, 0.8)");
    gradient.addColorStop(1, "rgba(168, 85, 247, 0.2)");
  
    // Create chart
    new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Progress %",
            data: progressValues,
            borderColor: "#a855f7",
            backgroundColor: gradient,
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              color: "#a1a1aa"
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${context.formattedValue}%`;
              }
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: "#a1a1aa",
              callback: function(value, index) {
                // Shorten long labels
                const label = this.getLabelForValue(value);
                if (label.length > 15) {
                  return label.substr(0, 12) + "...";
                }
                return label;
              }
            },
            grid: {
              color: "rgba(255, 255, 255, 0.05)"
            }
          },
          y: {
            ticks: {
              color: "#a1a1aa"
            },
            grid: {
              color: "rgba(255, 255, 255, 0.05)"
            }
          }
        },
        animation: {
          duration: 2000,
          easing: "easeOutQuart"
        }
      }
    });
  }
  
  // Function to create trend chart
  function createTrendChart(data) {
    // Remove any existing chart
    const chartContainer = document.querySelector(".chart-container");
    if (!chartContainer) return;
  
    // Clear previous chart
    chartContainer.innerHTML = "";
  
    if (data.length === 0) {
      chartContainer.innerHTML = '<div style="text-align: center; padding: 50px 0; color: #a855f7;">No trend data available for this category.</div>';
      return;
    }
  
    // Create new canvas
    const canvas = document.createElement("canvas");
    canvas.id = "trendChart";
    chartContainer.appendChild(canvas);
  
    const ctx = canvas.getContext("2d");
  
    // Extract data for chart
    const labels = data.map(item => item.title);
    const progressValues = data.map(item => item.progress);
  
    // Create gradient for chart
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, "rgba(139, 92, 246, 0.8)");
    gradient.addColorStop(1, "rgba(139, 92, 246, 0.2)");
  
    // Create chart
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Progress %",
            data: progressValues,
            backgroundColor: gradient,
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              color: "#a1a1aa"
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: "#a1a1aa",
              callback: function(value, index) {
                // Shorten long labels
                const label = this.getLabelForValue(value);
                if (label.length > 15) {
                  return label.substr(0, 12) + "...";
                }
                return label;
              }
            },
            grid: {
              color: "rgba(255, 255, 255, 0.05)"
            }
          },
          y: {
            ticks: {
              color: "#a1a1aa"
            },
            grid: {
              color: "rgba(255, 255, 255, 0.05)"
            }
          }
        },
        animation: {
          duration: 2000,
          easing: "easeOutQuart"
        }
      }
    });
  }
  
  // Function to display progress items
  function displayProgressItems(data) {
    const progressList = document.getElementById("progressList");
    if (!progressList) return;
    
    progressList.innerHTML = ""; // Clear existing items
  
    if (data.length === 0) {
      progressList.innerHTML = '<div style="text-align: center; padding: 20px; color: #a855f7;">No progress data available for this category.</div>';
      return;
    }
  
    data.forEach(item => {
      const progressItem = document.createElement("div");
      progressItem.className = "progress-item";
  
      progressItem.innerHTML = `
        <h3>${item.title}</h3>
        <p>Category: ${item.category}</p>
        <div class="progress-bar">
          <div class="progress-bar-fill" style="width: ${item.progress}%"></div>
        </div>
        <p>${item.progress}% Complete</p>
      `;
  
      progressList.appendChild(progressItem);
    });
  }
  
  // Function to filter data by category and update all UI elements
  function filterByCategory(category) {
    const allData = getAllData();
    let filteredData = allData;
  
    if (category !== "All") {
      filteredData = allData.filter(item => item.category === category);
    }
  
    // Update all UI elements with filtered data
    updateStatistics(filteredData);
  
    // Update the appropriate chart based on which tab is active
    const progressTab = document.getElementById("progressTab");
    if (progressTab && progressTab.classList.contains("active")) {
      createProgressChart(filteredData);
    } else {
      createTrendChart(filteredData);
    }
  
    displayProgressItems(filteredData);
  
    // Update category title
    const categoryTitle = document.getElementById("categoryTitle");
    if (categoryTitle) {
      categoryTitle.textContent = category === "All" ? "All Categories" : category;
    }
  }
  
  // Function to set up event listeners
  function setupEventListeners() {
    // Category filter
    const categoryFilter = document.getElementById("categoryFilter");
    if (categoryFilter) {
      categoryFilter.addEventListener("change", function() {
        filterByCategory(this.value);
      });
    }
  
    // Tab switching
    const progressTab = document.getElementById("progressTab");
    const trendTab = document.getElementById("trendTab");
  
    if (progressTab && trendTab) {
      progressTab.addEventListener("click", () => {
        progressTab.classList.add("active");
        trendTab.classList.remove("active");
  
        // Get current category filter and update chart
        const category = document.getElementById("categoryFilter").value;
        const allData = getAllData();
        const filteredData = category === "All" ? allData : allData.filter(item => item.category === category);
        createProgressChart(filteredData);
      });
  
      trendTab.addEventListener("click", () => {
        trendTab.classList.add("active");
        progressTab.classList.remove("active");
  
        // Get current category filter and update chart
        const category = document.getElementById("categoryFilter").value;
        const allData = getAllData();
        const filteredData = category === "All" ? allData : allData.filter(item => item.category === category);
        createTrendChart(filteredData);
      });
    }
  }
  
  // Function to update XP display (can be called from games.js)
  window.updateXPDisplay = function(score) {
    document.getElementById("currentScore").textContent = score;
  };
  