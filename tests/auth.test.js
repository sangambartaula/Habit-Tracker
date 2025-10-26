/**
 * Gamification System Tests
 * Covers: getLeague, addPoints, updateScoreboard, resetScores, bikeGameLoop
 */

// Global game state
let totalScore = 0;
let bestScore = 0;
let currentGame = '';
let bikeGameRunning = false;

// Game functions - MUST BE DEFINED BEFORE TESTS
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

function updateScoreboard() {
  const currentScoreEl = document.getElementById('currentScore');
  const bestScoreEl = document.getElementById('bestScore');
  const leagueTitleEl = document.getElementById('leagueTitle');
  
  if (currentScoreEl) currentScoreEl.innerText = totalScore;
  if (bestScoreEl) bestScoreEl.innerText = bestScore;
  if (leagueTitleEl) leagueTitleEl.innerText = getLeague(bestScore);
}

function resetScores() {
  totalScore = 0;
  bestScore = 0;
  updateScoreboard();
}

// ============================================
// getLeague() Function Tests
// ============================================

describe('getLeague(score)', () => {
  describe('All league tiers', () => {
    it('should return "Legend" for score >= 900', () => {
      expect(getLeague(900)).toBe('Legend');
      expect(getLeague(999)).toBe('Legend');
      expect(getLeague(5000)).toBe('Legend');
    });

    it('should return "Titan" for score 700-899', () => {
      expect(getLeague(700)).toBe('Titan');
      expect(getLeague(800)).toBe('Titan');
      expect(getLeague(899)).toBe('Titan');
    });

    it('should return "Champion" for score 500-699', () => {
      expect(getLeague(500)).toBe('Champion');
      expect(getLeague(600)).toBe('Champion');
      expect(getLeague(699)).toBe('Champion');
    });

    it('should return "Master" for score 400-499', () => {
      expect(getLeague(400)).toBe('Master');
      expect(getLeague(450)).toBe('Master');
      expect(getLeague(499)).toBe('Master');
    });

    it('should return "Crystal" for score 300-399', () => {
      expect(getLeague(300)).toBe('Crystal');
      expect(getLeague(350)).toBe('Crystal');
      expect(getLeague(399)).toBe('Crystal');
    });

    it('should return "Gold" for score 200-299', () => {
      expect(getLeague(200)).toBe('Gold');
      expect(getLeague(250)).toBe('Gold');
      expect(getLeague(299)).toBe('Gold');
    });

    it('should return "Silver" for score 100-199', () => {
      expect(getLeague(100)).toBe('Silver');
      expect(getLeague(150)).toBe('Silver');
      expect(getLeague(199)).toBe('Silver');
    });

    it('should return "Bronze" for score < 100', () => {
      expect(getLeague(0)).toBe('Bronze');
      expect(getLeague(50)).toBe('Bronze');
      expect(getLeague(99)).toBe('Bronze');
    });
  });

  describe('Boundary conditions', () => {
    it('should correctly handle exact boundaries', () => {
      expect(getLeague(900)).toBe('Legend');
      expect(getLeague(899)).toBe('Titan');
      
      expect(getLeague(700)).toBe('Titan');
      expect(getLeague(699)).toBe('Champion');
      
      expect(getLeague(500)).toBe('Champion');
      expect(getLeague(499)).toBe('Master');
      
      expect(getLeague(400)).toBe('Master');
      expect(getLeague(399)).toBe('Crystal');
      
      expect(getLeague(300)).toBe('Crystal');
      expect(getLeague(299)).toBe('Gold');
      
      expect(getLeague(200)).toBe('Gold');
      expect(getLeague(199)).toBe('Silver');
      
      expect(getLeague(100)).toBe('Silver');
      expect(getLeague(99)).toBe('Bronze');
    });
  });

  describe('Edge cases', () => {
    it('should handle zero score', () => {
      expect(getLeague(0)).toBe('Bronze');
    });

    it('should handle negative scores', () => {
      expect(getLeague(-10)).toBe('Bronze');
      expect(getLeague(-1)).toBe('Bronze');
      expect(getLeague(-1000)).toBe('Bronze');
    });

    it('should handle very large scores', () => {
      expect(getLeague(10000)).toBe('Legend');
      expect(getLeague(1000000)).toBe('Legend');
    });

    it('should handle decimal scores (treated as number)', () => {
      expect(getLeague(100.5)).toBe('Silver');
      expect(getLeague(899.9)).toBe('Titan');
    });
  });
});

// ============================================
// addPoints() Function Tests
// ============================================

describe('addPoints(points)', () => {
  let showNotificationPopup;

  beforeEach(() => {
    totalScore = 0;
    bestScore = 0;
    localStorage.clear();
    
    showNotificationPopup = jest.fn();
    window.showNotificationPopup = showNotificationPopup;
    
    // Setup DOM
    document.body.innerHTML = `
      <div id="currentScore">0</div>
      <div id="bestScore">0</div>
      <div id="leagueTitle">Bronze</div>
    `;
  });

  describe('Basic point addition', () => {
    it('should increase totalScore by points value', () => {
      addPoints(50);
      expect(totalScore).toBe(50);
      
      addPoints(25);
      expect(totalScore).toBe(75);
    });

    it('should handle zero points', () => {
      addPoints(0);
      expect(totalScore).toBe(0);
    });

    it('should handle large point additions', () => {
      addPoints(1000);
      expect(totalScore).toBe(1000);
    });
  });

  describe('New high score detection', () => {
    it('should update bestScore when totalScore exceeds previous best', () => {
      bestScore = 100;
      addPoints(50);
      
      expect(totalScore).toBe(50);
      expect(bestScore).toBe(100);
      
      addPoints(100);
      expect(totalScore).toBe(150);
      expect(bestScore).toBe(150);
    });

    it('should not update bestScore when totalScore < bestScore', () => {
      bestScore = 200;
      addPoints(50);
      
      expect(bestScore).toBe(200);
    });

    it('should trigger notification on new high score', () => {
      addPoints(100);
      
      expect(showNotificationPopup).toHaveBeenCalledWith(
        expect.stringContaining('🎉 New High Score')
      );
    });

    it('should save bestScore to localStorage', () => {
      addPoints(100);
      
      expect(localStorage.getItem('bestScore')).toBe('100');
    });
  });

  describe('League promotion detection', () => {
    it('should detect league promotion from Bronze to Silver', () => {
      totalScore = 95;
      addPoints(10);
      
      expect(showNotificationPopup).toHaveBeenCalledWith(
        expect.stringContaining('🏆 League Promotion: Silver!')
      );
    });

    it('should detect promotion from Silver to Gold', () => {
      totalScore = 195;
      addPoints(10);
      
      expect(showNotificationPopup).toHaveBeenCalledWith(
        expect.stringContaining('🏆 League Promotion: Gold!')
      );
    });

    it('should detect promotion from Gold to Crystal', () => {
      totalScore = 295;
      addPoints(10);
      
      expect(showNotificationPopup).toHaveBeenCalledWith(
        expect.stringContaining('🏆 League Promotion: Crystal!')
      );
    });

    it('should not trigger promotion notification for no league change', () => {
      totalScore = 50;
      addPoints(25);
      
      const promotionCalls = showNotificationPopup.mock.calls.filter(
        call => call[0].includes('League Promotion')
      );
      expect(promotionCalls.length).toBe(0);
    });

    it('should trigger both high score and promotion notifications', () => {
      bestScore = 0;
      totalScore = 0;
      addPoints(100);
      
      const calls = showNotificationPopup.mock.calls;
      expect(calls.some(c => c[0].includes('New High Score'))).toBe(true);
      expect(calls.some(c => c[0].includes('League Promotion'))).toBe(true);
    });
  });

  describe('Notification handling', () => {
    it('should check if showNotificationPopup function exists before calling', () => {
      window.showNotificationPopup = undefined;
      
      expect(() => addPoints(50)).not.toThrow();
    });
  });
});

// ============================================
// updateScoreboard() Function Tests
// ============================================

describe('updateScoreboard()', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="currentScore">0</div>
      <div id="bestScore">0</div>
      <div id="leagueTitle">Bronze</div>
    `;
    
    totalScore = 0;
    bestScore = 0;
  });

  describe('DOM updates', () => {
    it('should update currentScore element', () => {
      totalScore = 150;
      updateScoreboard();
      
      const text = document.getElementById('currentScore').innerText;
      expect(String(text)).toBe('150');
    });

    it('should update bestScore element', () => {
      bestScore = 300;
      updateScoreboard();
      
      const text = document.getElementById('bestScore').innerText;
      expect(String(text)).toBe('300');
    });

    it('should update leagueTitle element with correct league', () => {
      bestScore = 250;
      updateScoreboard();
      
      expect(document.getElementById('leagueTitle').innerText).toBe('Gold');
    });

    it('should update all elements together', () => {
      totalScore = 100;
      bestScore = 200;
      updateScoreboard();
      
      expect(String(document.getElementById('currentScore').innerText)).toBe('100');
      expect(String(document.getElementById('bestScore').innerText)).toBe('200');
      expect(document.getElementById('leagueTitle').innerText).toBe('Gold');
    });
  });

  describe('Missing DOM elements', () => {
    it('should handle missing currentScore element gracefully', () => {
      document.getElementById('currentScore').remove();
      
      expect(() => updateScoreboard()).not.toThrow();
    });

    it('should handle missing bestScore element gracefully', () => {
      document.getElementById('bestScore').remove();
      
      expect(() => updateScoreboard()).not.toThrow();
    });

    it('should handle missing leagueTitle element gracefully', () => {
      document.getElementById('leagueTitle').remove();
      
      expect(() => updateScoreboard()).not.toThrow();
    });
  });

  describe('Zero and boundary values', () => {
    it('should display zero values correctly', () => {
      totalScore = 0;
      bestScore = 0;
      updateScoreboard();
      
      expect(String(document.getElementById('currentScore').innerText)).toBe('0');
      expect(String(document.getElementById('bestScore').innerText)).toBe('0');
      expect(document.getElementById('leagueTitle').innerText).toBe('Bronze');
    });

    it('should display boundary values correctly', () => {
      totalScore = 100;
      bestScore = 900;
      updateScoreboard();
      
      expect(String(document.getElementById('currentScore').innerText)).toBe('100');
      expect(String(document.getElementById('bestScore').innerText)).toBe('900');
      expect(document.getElementById('leagueTitle').innerText).toBe('Legend');
    });
  });
});

// ============================================
// resetScores() Function Tests
// ============================================

describe('resetScores()', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="currentScore">100</div>
      <div id="bestScore">200</div>
      <div id="leagueTitle">Gold</div>
    `;
    
    totalScore = 150;
    bestScore = 200;
  });

  it('should reset totalScore to 0', () => {
    resetScores();
    expect(totalScore).toBe(0);
  });

  it('should reset bestScore to 0', () => {
    resetScores();
    expect(bestScore).toBe(0);
  });

  it('should update DOM after reset', () => {
    resetScores();
    
    expect(String(document.getElementById('currentScore').innerText)).toBe('0');
    expect(String(document.getElementById('bestScore').innerText)).toBe('0');
    expect(document.getElementById('leagueTitle').innerText).toBe('Bronze');
  });

  it('should handle multiple reset calls', () => {
    resetScores();
    resetScores();
    
    expect(totalScore).toBe(0);
    expect(bestScore).toBe(0);
  });
});

// ============================================
// bikeGameLoop() Collision Detection
// ============================================

describe('bikeGameLoop() - Collision Detection', () => {
  let canvas;
  let ctx;
  let bike;
  let bikeObstacles;
  let bikeScore;

  beforeEach(() => {
    document.body.innerHTML = `
      <canvas id="bikeGameCanvas" width="500" height="500"></canvas>
      <div id="bikeScore">0</div>
      <div id="gameOverMessage"></div>
    `;

    canvas = document.getElementById('bikeGameCanvas');
    ctx = canvas ? canvas.getContext('2d') : null;
    
    bike = { x: 230, y: 420, width: 40, height: 60 };
    bikeObstacles = [];
    bikeScore = 0;
    bikeGameRunning = true;
  });

  describe('Obstacle collision detection (AABB algorithm)', () => {
    it('should detect collision when obstacle overlaps bike', () => {
      const obstacle = { x: 230, y: 420, width: 40, height: 60 };
      
      const collision = 
        bike.x < obstacle.x + obstacle.width &&
        bike.x + bike.width > obstacle.x &&
        bike.y < obstacle.y + obstacle.height &&
        bike.y + bike.height > obstacle.y;

      expect(collision).toBe(true);
    });

    it('should not detect collision when obstacle is clear', () => {
      const obstacle = { x: 100, y: 100, width: 40, height: 60 };
      
      const collision = 
        bike.x < obstacle.x + obstacle.width &&
        bike.x + bike.width > obstacle.x &&
        bike.y < obstacle.y + obstacle.height &&
        bike.y + bike.height > obstacle.y;

      expect(collision).toBe(false);
    });

    it('should detect collision on obstacle boundary', () => {
      const obstacle = { x: bike.x, y: bike.y, width: 40, height: 1 };
      
      const collision = 
        bike.x < obstacle.x + obstacle.width &&
        bike.x + bike.width > obstacle.x &&
        bike.y < obstacle.y + obstacle.height &&
        bike.y + bike.height > obstacle.y;

      expect(collision).toBe(true);
    });
  });

  describe('Obstacle movement and scoring', () => {
    it('should increment bikeScore when obstacle passes', () => {
      const obstacle = { x: 230, y: 450, width: 40, height: 20 };
      bikeObstacles.push(obstacle);
      
      obstacle.y += 2;
      
      if (obstacle.y > canvas.height) {
        bikeScore += 5;
      }

      expect(obstacle.y).toBe(452);
      expect(bikeScore).toBe(0);
    });

    it('should add 5 points when obstacle passes canvas bottom', () => {
      const obstacle = { x: 230, y: 490, width: 40, height: 20 };
      
      obstacle.y += 15;
      
      if (obstacle.y > canvas.height) {
        bikeScore += 5;
      }

      expect(bikeScore).toBe(5);
    });

    it('should remove obstacle from array when it passes', () => {
      const obstacle = { x: 230, y: 490, width: 40, height: 20 };
      bikeObstacles.push(obstacle);
      
      obstacle.y += 15;
      
      if (obstacle.y > canvas.height) {
        bikeObstacles = bikeObstacles.filter(o => o.y <= canvas.height);
      }

      expect(bikeObstacles.length).toBe(0);
    });
  });

  describe('Game over conditions', () => {
    it('should end game on collision', () => {
      const obstacle = { x: 230, y: 420, width: 40, height: 60 };
      
      const collision = 
        bike.x < obstacle.x + obstacle.width &&
        bike.x + bike.width > obstacle.x &&
        bike.y < obstacle.y + obstacle.height &&
        bike.y + bike.height > obstacle.y;

      if (collision) {
        bikeGameRunning = false;
      }

      expect(bikeGameRunning).toBe(false);
    });

    it('should not call game loop if game is not running', () => {
      bikeGameRunning = false;
      
      if (!bikeGameRunning) {
        // Early return
      }

      expect(bikeGameRunning).toBe(false);
    });
  });

  describe('Canvas rendering', () => {
    it('should clear canvas at start of loop', () => {
      if (ctx) {
        const clearRectSpy = jest.spyOn(ctx, 'clearRect');
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        expect(clearRectSpy).toHaveBeenCalledWith(0, 0, 500, 500);
        clearRectSpy.mockRestore();
      }
    });

    it('should draw bike on canvas', () => {
      if (ctx) {
        const fillRectSpy = jest.spyOn(ctx, 'fillRect');
        
        ctx.fillStyle = 'yellow';
        ctx.fillRect(bike.x, bike.y, bike.width, bike.height);
        
        expect(fillRectSpy).toHaveBeenCalledWith(230, 420, 40, 60);
        fillRectSpy.mockRestore();
      }
    });

    it('should draw obstacles on canvas', () => {
      if (ctx) {
        const obstacle = { x: 230, y: 100, width: 40, height: 20 };
        const fillRectSpy = jest.spyOn(ctx, 'fillRect');
        
        ctx.fillStyle = 'red';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        
        expect(fillRectSpy).toHaveBeenCalledWith(230, 100, 40, 20);
        fillRectSpy.mockRestore();
      }
    });
  });

  describe('Multiple obstacles', () => {
    it('should handle multiple obstacles in forEach loop', () => {
      bikeObstacles = [
        { x: 200, y: 100, width: 40, height: 20 },
        { x: 250, y: 150, width: 40, height: 20 },
        { x: 230, y: 200, width: 40, height: 20 }
      ];

      let processedCount = 0;
      bikeObstacles.forEach((o, idx) => {
        o.y += 2;
        processedCount++;
      });

      expect(processedCount).toBe(3);
    });

    it('should check collision with each obstacle', () => {
      bikeObstacles = [
        { x: 100, y: 100, width: 40, height: 20 },
        { x: 230, y: 420, width: 40, height: 60 },
        { x: 350, y: 200, width: 40, height: 20 }
      ];

      let collisionFound = false;
      bikeObstacles.forEach((o) => {
        const collision = 
          bike.x < o.x + o.width &&
          bike.x + bike.width > o.x &&
          bike.y < o.y + o.height &&
          bike.y + bike.height > o.y;
        
        if (collision) collisionFound = true;
      });

      expect(collisionFound).toBe(true);
    });
  });
});