// Global variables
let totalScore = 0;
let bestScore = parseInt(localStorage.getItem('bestScore')) || 0;
let currentGame = "";

// Game functions
function updateScoreboard() {
  document.getElementById('currentScore').innerText = totalScore;
  document.getElementById('bestScore').innerText = bestScore;
  document.getElementById('leagueTitle').innerText = getLeague(bestScore);
}

function getLeague(score) {
  if (score >= 900) return "Legend";
  if (score >= 700) return "Titan";
  if (score >= 500) return "Champion";
  if (score >= 400) return "Master";
  if (score >= 300) return "Crystal";
  if (score >= 200) return "Gold";
  if (score >= 100) return "Silver";
  return "Bronze";
}

function addPoints(points) {
  totalScore += points;
  if (totalScore > bestScore) {
    bestScore = totalScore;
    localStorage.setItem('bestScore', bestScore);
    if (typeof showNotificationPopup === 'function') {
      showNotificationPopup(`🎉 New High Score: ${bestScore}!`);
    }
  }
  updateScoreboard();
  
  // Check for league promotions
  const newLeague = getLeague(totalScore);
  const oldLeague = getLeague(totalScore - points);
  if (newLeague !== oldLeague) {
    if (typeof showNotificationPopup === 'function') {
      showNotificationPopup(`🏆 League Promotion: ${newLeague}!`);
    }
  }
}

function resetScores() {
  totalScore = 0;
  bestScore = 0;
  updateScoreboard();
}

// Bike game
const bikeCanvas = document.getElementById("bikeGameCanvas");
const bikeCtx = bikeCanvas.getContext("2d");
let bike, bikeObstacles, bikeScore, bikeGameRunning = false;

function startBikeGame() {
  currentGame = "bike";
  bike = { x: 230, y: 420, width: 40, height: 60 }; // better centered vertically
  bikeObstacles = [];
  bikeScore = 0;
  document.getElementById("bikeScore").innerText = bikeScore;
  document.getElementById("gameOverMessage").style.display = "none";
  bikeGameRunning = true;
  bikeGameLoop();
}

function bikeGameLoop() {
  if (bikeGameRunning) {
    bikeCtx.clearRect(0, 0, bikeCanvas.width, bikeCanvas.height);
    bikeCtx.fillStyle = "yellow";
    bikeCtx.fillRect(bike.x, bike.y, bike.width, bike.height);
    bikeObstacles.forEach((o, idx) => {
      bikeCtx.fillStyle = "red";
      bikeCtx.fillRect(o.x, o.y, o.width, o.height);
      o.y += 2;
      if (o.y > bikeCanvas.height) {
        bikeScore += 5;
        addPoints(5);
        document.getElementById("bikeScore").innerText = bikeScore;
        bikeObstacles.splice(idx, 1);
      }
      if (bike.x < o.x + o.width && bike.x + bike.width > o.x && bike.y < o.y + o.height && bike.y + bike.height > o.y) {
        bikeGameRunning = false;
        if (typeof showNotificationPopup === 'function') {
          showNotificationPopup(`Game Over! Your score: ${bikeScore}`, true);
        }
      }
    });
    requestAnimationFrame(bikeGameLoop);
  }
}

function pauseBikeGame() { bikeGameRunning = false; }

setInterval(() => {
  if (bikeGameRunning) bikeObstacles.push({ x: Math.random() * 350, y: 0, width: 50, height: 50 });
}, 2000);

//Aim Trainer
const aimCanvas = document.getElementById("aimCanvas");
const aimCtx = aimCanvas.getContext("2d");
let aimTarget = { x: 100, y: 100, radius: 20 };
let aimScore = 0, aimTime = 30, aimInterval;
let aimRunning = false;

function startAimGame() {
  currentGame = "aim";
  aimRunning = true;
  aimScore = 0;
  aimTime = 30;
  drawAimTarget();
  document.getElementById("aimScore").innerText = aimScore;
  document.getElementById("aimTimer").innerText = aimTime;

  clearInterval(aimInterval);
  aimInterval = setInterval(() => {
    aimTime--;
    document.getElementById("aimTimer").innerText = aimTime;
    if (aimTime <= 0) {
      clearInterval(aimInterval);
      aimRunning = false;
      aimCtx.clearRect(0, 0, aimCanvas.width, aimCanvas.height);
    }
  }, 1000);
}

function drawAimTarget() {
  aimCtx.clearRect(0, 0, aimCanvas.width, aimCanvas.height);
  aimCtx.fillStyle = "red";
  aimCtx.beginPath();
  aimCtx.arc(aimTarget.x, aimTarget.y, aimTarget.radius, 0, Math.PI * 2);
  aimCtx.fill();
}

aimCanvas.addEventListener('click', (e) => {
  if (!aimRunning) return;
  const rect = aimCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  if (Math.hypot(x - aimTarget.x, y - aimTarget.y) <= aimTarget.radius) {
    aimScore++;
    addPoints(1);
    document.getElementById("aimScore").innerText = aimScore;
    aimTarget = { x: Math.random() * 260 + 20, y: Math.random() * 260 + 20, radius: 20 };
    drawAimTarget();
  }
});
function pauseAimGame() {
  clearInterval(aimInterval);
  aimRunning = false;
}
// Memory Match
const memoryGrid = document.getElementById('memoryGrid');
const emojis = ['🍎', '🍌', '🍇', '🍉', '🍓', '��'];
let memoryCards, selectedCards, matchedCards;
let memoryScore = 0, memoryTime = 60, memoryInterval;
let memoryRunning = false;

function startMemoryGame() {
  currentGame = "memory";
  memoryGrid.innerHTML = '';
  memoryCards = [...emojis, ...emojis];
  selectedCards = [];
  matchedCards = [];
  memoryCards.sort(() => 0.5 - Math.random());
  memoryCards.forEach((emoji, i) => {
    const card = document.createElement('button');
    card.textContent = '?';
    card.style.fontSize = '2em';
    card.style.margin = '5px';
    card.dataset.emoji = emoji;
    card.dataset.index = i;
    card.onclick = () => handleMemoryClick(card, i);
    memoryGrid.appendChild(card);
  });
  memoryScore = 0;
  document.getElementById("memoryScore").innerText = memoryScore;
  memoryTime = 60;
  document.getElementById("memoryTimer").innerText = memoryTime;
  clearInterval(memoryInterval);
  memoryRunning = true;
  memoryInterval = setInterval(() => {
    memoryTime--;
    document.getElementById("memoryTimer").innerText = memoryTime;
    if (memoryTime <= 0) {
      clearInterval(memoryInterval);
      memoryRunning = false;
    }
  }, 1000);
}

function handleMemoryClick(card, index) {
  if (!memoryRunning) return;
  if (matchedCards.includes(index) || selectedCards.includes(index)) return;
  card.textContent = card.dataset.emoji;
  selectedCards.push(index);
  if (selectedCards.length === 2) {
    const [first, second] = selectedCards;
    const firstCard = memoryGrid.children[first];
    const secondCard = memoryGrid.children[second];
    if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
      matchedCards.push(first, second);
      memoryScore += 10;
      addPoints(10);
      document.getElementById("memoryScore").innerText = memoryScore;
    } else {
      setTimeout(() => {
        firstCard.textContent = '?';
        secondCard.textContent = '?';
      }, 600);
    }
    selectedCards = [];
  }
}
// Car Avoidance
const carCanvas = document.getElementById("carCanvas");
const carCtx = carCanvas.getContext("2d");
let car, carObstacles, carScore, carGameRunning = false;

function startCarGame() {
  currentGame = "car";
  car = { x: 230, width: 40, height: 60 }; // centered
  carObstacles = [];
  carScore = 0;
  document.getElementById("carScore").innerText = carScore;
  carGameRunning = true;
  carGameLoop();
}

function carGameLoop() {
  if (carGameRunning) {
    carCtx.clearRect(0, 0, carCanvas.width, carCanvas.height);
    carCtx.fillStyle = "lime";
    carCtx.fillRect(car.x, 400, car.width, car.height);

    carObstacles.forEach((c, i) => {
      carCtx.fillStyle = "red";
      carCtx.fillRect(c.x, c.y, 40, 60);
      c.y += 4;
      if (c.y > 500) {
        carScore += 5;
        addPoints(5);
        document.getElementById("carScore").innerText = carScore;
        carObstacles.splice(i, 1);
      }
      if (c.y + 60 >= 400 && c.x < car.x + car.width && c.x + 40 > car.x) {
        carGameRunning = false;
        if (typeof showNotificationPopup === 'function') {
          showNotificationPopup(`💥 Crash! Your Score: ${carScore}`, true);
        }
      }
    });

    requestAnimationFrame(carGameLoop);
  }
}

function pauseCarGame() {
  carGameRunning = false;
}

setInterval(() => {
  if (carGameRunning) carObstacles.push({ x: Math.random() * (carCanvas.width - 40), y: -60 });
}, 1200);
// Star Catcher
const starCanvas = document.getElementById("starCanvas");
const starCtx = starCanvas.getContext("2d");
let basket, stars, starScore, starRunning = false;
let missedStars = 0;

function startStarGame() {
  currentGame = "star";
  basket = { x: 230, width: 60, height: 20 }; // wider basket, centered
  stars = [];
  starScore = 0;
  missedStars = 0;
  document.getElementById("starScore").innerText = starScore;
  starRunning = true;
  starGameLoop();
}

function starGameLoop() {
  if (starRunning) {
    starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
    starCtx.fillStyle = "yellow";
    starCtx.fillRect(basket.x, 340, basket.width, basket.height);

    stars.forEach((s, i) => {
      starCtx.beginPath();
      starCtx.arc(s.x, s.y, 8, 0, Math.PI * 2);
      starCtx.fillStyle = '#f1c40f';
      starCtx.fill();
      s.y += 3;
      if (s.y > 360) {
        missedStars++;
        stars.splice(i, 1);
        if (missedStars >= 5) {
          starRunning = false;
          alert('💥 Game Over! You missed too many stars!');
        }
      }
      if (s.y + 8 >= 340 && s.x > basket.x && s.x < basket.x + basket.width) {
        stars.splice(i, 1);
        starScore += 5;
        addPoints(5);
        document.getElementById("starScore").innerText = starScore;
      }
    });

    requestAnimationFrame(starGameLoop);
  }
}

function pauseStarGame() {
  starRunning = false;
}
setInterval(() => {
  stars.push({ x: Math.random() * (starCanvas.width - 16) + 8, y: -10 });
}, 1000);


//Control 
document.addEventListener('keydown', (e) => {
  if (currentGame === "bike") {
    if (e.key === 'ArrowLeft') bike.x = Math.max(0, bike.x - 20);
    if (e.key === 'ArrowRight') bike.x = Math.min(bikeCanvas.width - bike.width, bike.x + 20);
  }
  if (currentGame === "car") {
    if (e.key === 'ArrowLeft') car.x = Math.max(0, car.x - 20);
    if (e.key === 'ArrowRight') car.x = Math.min(carCanvas.width - car.width, car.x + 20);
  }
  if (currentGame === "star") {
    if (e.key === 'ArrowLeft') basket.x = Math.max(0, basket.x - 20);
    if (e.key === 'ArrowRight') basket.x = Math.min(starCanvas.width - basket.width, basket.x + 20);
  }
});

function closeGame(id) {
  document.getElementById(id).style.display = 'none';
  document.body.style.overflow = 'auto';

  // Stop whichever game is running
  if (currentGame === "bike") bikeGameRunning = false;
  if (currentGame === "car") carGameRunning = false;
  if (currentGame === "star") starRunning = false;
  if (currentGame === "aim") {
    clearInterval(aimInterval);
    aimRunning = false;
    aimCtx.clearRect(0, 0, aimCanvas.width, aimCanvas.height);
  }
  if (currentGame === "memory") {
    clearInterval(memoryInterval);
    memoryRunning = false;
  }
}

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

  // Add habit reminder notification
  if (typeof showNotificationPopup === 'function') {
    showNotificationPopup("🎮 Time for some fun! Complete a mini-game to earn points and improve your habits!");
  }

  // Initialize scoreboard
  updateScoreboard();
});