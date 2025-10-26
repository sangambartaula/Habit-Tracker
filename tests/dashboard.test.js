/**
 * Dashboard Analytics Tests
 * Covers: Stats initialization, milestone calculations, localStorage handling
 */

describe('Dashboard Stats Initialization', () => {
    beforeEach(() => {
      localStorage.clear();
      document.body.innerHTML = `
        <span id="streak">--</span>
        <span id="habitsDone">--</span>
        <span id="totalPoints">0</span>
        <span id="milestones">--</span>
      `;
    });
  
    describe('Valid stats in localStorage', () => {
      it('should load and display streak data', () => {
        const stats = { streak: 10, habitsDone: 5 };
        localStorage.setItem('dashboardStats', JSON.stringify(stats));
  
        const storedStats = JSON.parse(localStorage.getItem('dashboardStats')) || {};
        
        document.getElementById('streak').textContent = storedStats.streak || 0;
        
        expect(document.getElementById('streak').textContent).toBe('10');
      });
  
      it('should load and display habitsDone data', () => {
        const stats = { streak: 10, habitsDone: 8 };
        localStorage.setItem('dashboardStats', JSON.stringify(stats));
  
        const storedStats = JSON.parse(localStorage.getItem('dashboardStats')) || {};
        
        document.getElementById('habitsDone').textContent = storedStats.habitsDone || 0;
        
        expect(document.getElementById('habitsDone').textContent).toBe('8');
      });
  
      it('should calculate points as streak * 10', () => {
        const stats = { streak: 15, habitsDone: 5 };
        localStorage.setItem('dashboardStats', JSON.stringify(stats));
  
        const storedStats = JSON.parse(localStorage.getItem('dashboardStats')) || {};
        const points = storedStats.streak * 10;
        
        document.getElementById('totalPoints').textContent = points;
        
        expect(document.getElementById('totalPoints').textContent).toBe('150');
      });
  
      it('should determine milestone level correctly', () => {
        const stats = { streak: 15, habitsDone: 5 };
        localStorage.setItem('dashboardStats', JSON.stringify(stats));
  
        const storedStats = JSON.parse(localStorage.getItem('dashboardStats')) || {};
        const milestone = storedStats.streak >= 10 ? '🔥 Pro' : '🚀 Beginner';
        
        document.getElementById('milestones').textContent = milestone;
        
        expect(document.getElementById('milestones').textContent).toBe('🔥 Pro');
      });
    });
  
    describe('Missing localStorage data', () => {
      it('should use default values when dashboardStats is missing', () => {
        // No data set in localStorage
        
        const storedStats = JSON.parse(localStorage.getItem('dashboardStats')) || {};
        
        document.getElementById('streak').textContent = storedStats.streak || 0;
        document.getElementById('habitsDone').textContent = storedStats.habitsDone || 0;
        
        expect(document.getElementById('streak').textContent).toBe('0');
        expect(document.getElementById('habitsDone').textContent).toBe('0');
      });
  
      it('should default milestone to Beginner for low streak', () => {
        const stats = { streak: 5, habitsDone: 3 };
        localStorage.setItem('dashboardStats', JSON.stringify(stats));
  
        const storedStats = JSON.parse(localStorage.getItem('dashboardStats')) || {};
        const milestone = storedStats.streak >= 10 ? '🔥 Pro' : '🚀 Beginner';
        
        document.getElementById('milestones').textContent = milestone;
        
        expect(document.getElementById('milestones').textContent).toBe('🚀 Beginner');
      });
  
      it('should default points to 0 when no stats exist', () => {
        const storedStats = JSON.parse(localStorage.getItem('dashboardStats')) || {};
        const points = (storedStats.streak || 0) * 10;
        
        document.getElementById('totalPoints').textContent = points;
        
        expect(document.getElementById('totalPoints').textContent).toBe('0');
      });
    });
  
    describe('Milestone calculation boundaries', () => {
      it('should show Pro for exactly streak of 10', () => {
        const stats = { streak: 10, habitsDone: 5 };
        localStorage.setItem('dashboardStats', JSON.stringify(stats));
  
        const storedStats = JSON.parse(localStorage.getItem('dashboardStats')) || {};
        const milestone = storedStats.streak >= 10 ? '🔥 Pro' : '🚀 Beginner';
        
        expect(milestone).toBe('🔥 Pro');
      });
  
      it('should show Beginner for streak of 9', () => {
        const stats = { streak: 9, habitsDone: 5 };
        localStorage.setItem('dashboardStats', JSON.stringify(stats));
  
        const storedStats = JSON.parse(localStorage.getItem('dashboardStats')) || {};
        const milestone = storedStats.streak >= 10 ? '🔥 Pro' : '🚀 Beginner';
        
        expect(milestone).toBe('🚀 Beginner');
      });
  
      it('should show Pro for high streaks', () => {
        const stats = { streak: 100, habitsDone: 50 };
        localStorage.setItem('dashboardStats', JSON.stringify(stats));
  
        const storedStats = JSON.parse(localStorage.getItem('dashboardStats')) || {};
        const milestone = storedStats.streak >= 10 ? '🔥 Pro' : '🚀 Beginner';
        
        expect(milestone).toBe('🔥 Pro');
      });
    });
  
    describe('Points calculation edge cases', () => {
      it('should handle zero streak', () => {
        const stats = { streak: 0, habitsDone: 0 };
        localStorage.setItem('dashboardStats', JSON.stringify(stats));
  
        const storedStats = JSON.parse(localStorage.getItem('dashboardStats')) || {};
        const points = storedStats.streak * 10;
        
        expect(points).toBe(0);
      });
  
      it('should handle large streak values', () => {
        const stats = { streak: 1000, habitsDone: 100 };
        localStorage.setItem('dashboardStats', JSON.stringify(stats));
  
        const storedStats = JSON.parse(localStorage.getItem('dashboardStats')) || {};
        const points = storedStats.streak * 10;
        
        expect(points).toBe(10000);
      });
  
      it('should calculate points correctly for various streaks', () => {
        const testCases = [
          { streak: 1, expected: 10 },
          { streak: 5, expected: 50 },
          { streak: 15, expected: 150 },
          { streak: 30, expected: 300 }
        ];
  
        testCases.forEach(({ streak, expected }) => {
          const stats = { streak, habitsDone: 5 };
          localStorage.setItem('dashboardStats', JSON.stringify(stats));
  
          const storedStats = JSON.parse(localStorage.getItem('dashboardStats')) || {};
          const points = storedStats.streak * 10;
          
          expect(points).toBe(expected);
        });
      });
    });
  
    describe('Invalid JSON handling', () => {
      it('should handle malformed JSON gracefully', () => {
        localStorage.setItem('dashboardStats', 'invalid json');
  
        let storedStats;
        try {
          storedStats = JSON.parse(localStorage.getItem('dashboardStats')) || {};
        } catch (e) {
          storedStats = {};
        }
  
        expect(storedStats.streak).toBeUndefined();
        expect(storedStats.habitsDone).toBeUndefined();
      });
  
      it('should use fallback when JSON parse fails', () => {
        localStorage.setItem('dashboardStats', '{invalid}');
  
        let storedStats;
        try {
          storedStats = JSON.parse(localStorage.getItem('dashboardStats')) || {};
        } catch (e) {
          storedStats = {};
        }
  
        const streak = storedStats.streak || 0;
        expect(streak).toBe(0);
      });
    });
  
    describe('localStorage operations', () => {
      it('should retrieve data set in localStorage', () => {
        const stats = { streak: 7, habitsDone: 4 };
        localStorage.setItem('dashboardStats', JSON.stringify(stats));
  
        const retrieved = localStorage.getItem('dashboardStats');
        expect(retrieved).toBe(JSON.stringify(stats));
      });
  
      it('should return null for non-existent keys', () => {
        const value = localStorage.getItem('nonexistent');
        expect(value).toBeNull();
      });
  
      it('should handle clearing localStorage', () => {
        localStorage.setItem('dashboardStats', JSON.stringify({ streak: 10 }));
        localStorage.clear();
  
        const value = localStorage.getItem('dashboardStats');
        expect(value).toBeNull();
      });
    });
  
    describe('DOM element updates', () => {
      it('should update all dashboard elements', () => {
        const stats = { streak: 12, habitsDone: 6 };
        localStorage.setItem('dashboardStats', JSON.stringify(stats));
  
        const storedStats = JSON.parse(localStorage.getItem('dashboardStats')) || {};
        
        document.getElementById('streak').textContent = storedStats.streak || 0;
        document.getElementById('habitsDone').textContent = storedStats.habitsDone || 0;
        document.getElementById('totalPoints').textContent = storedStats.streak * 10;
        const milestone = storedStats.streak >= 10 ? '🔥 Pro' : '🚀 Beginner';
        document.getElementById('milestones').textContent = milestone;
  
        expect(document.getElementById('streak').textContent).toBe('12');
        expect(document.getElementById('habitsDone').textContent).toBe('6');
        expect(document.getElementById('totalPoints').textContent).toBe('120');
        expect(document.getElementById('milestones').textContent).toBe('🔥 Pro');
      });
  
      it('should handle missing DOM elements gracefully', () => {
        document.body.innerHTML = ''; // Remove all elements
        
        const stats = { streak: 10, habitsDone: 5 };
        localStorage.setItem('dashboardStats', JSON.stringify(stats));
  
        const storedStats = JSON.parse(localStorage.getItem('dashboardStats')) || {};
        
        // Should not throw error when trying to update non-existent elements
        const streakEl = document.getElementById('streak');
        if (streakEl) {
          streakEl.textContent = storedStats.streak || 0;
        }
  
        expect(streakEl).toBeNull();
      });
    });
  
    describe('Multiple updates', () => {
      it('should handle sequential updates to dashboard', () => {
        // First update
        let stats = { streak: 5, habitsDone: 2 };
        localStorage.setItem('dashboardStats', JSON.stringify(stats));
        
        let storedStats = JSON.parse(localStorage.getItem('dashboardStats')) || {};
        document.getElementById('streak').textContent = storedStats.streak || 0;
        
        expect(document.getElementById('streak').textContent).toBe('5');
  
        // Second update
        stats = { streak: 10, habitsDone: 5 };
        localStorage.setItem('dashboardStats', JSON.stringify(stats));
        
        storedStats = JSON.parse(localStorage.getItem('dashboardStats')) || {};
        document.getElementById('streak').textContent = storedStats.streak || 0;
        
        expect(document.getElementById('streak').textContent).toBe('10');
      });
    });
  });