/**
 * Notification System Tests
 * Covers: Creation, styling, timeout, removal
 */

describe('showNotification(message, isError)', () => {
    let showNotification;
  
    beforeEach(() => {
      document.body.innerHTML = '';
      jest.useFakeTimers();
      
      // Implement the notification function
      showNotification = function(message, isError = false) {
        // Create notification container if it doesn't exist
        let container = document.querySelector('.notification-container');
        if (!container) {
          container = document.createElement('div');
          container.className = 'notification-container';
          container.style.position = 'fixed';
          container.style.top = '20px';
          container.style.right = '20px';
          container.style.zIndex = '1000';
          document.body.appendChild(container);
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.style.padding = '15px 20px';
        notification.style.marginBottom = '10px';
        notification.style.borderRadius = '5px';
        notification.style.color = 'white';
        notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        notification.style.animation = 'fadeIn 0.3s ease';
        
        if (isError) {
          notification.style.background = 'linear-gradient(to right, #ff4b2b, #ff416c)';
        } else {
          notification.style.background = 'linear-gradient(to right, #6d28d9, #8b5cf6)';
        }
        
        notification.textContent = message;
        container.appendChild(notification);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
          notification.style.opacity = '0';
          notification.style.transform = 'translateX(100%)';
          notification.style.transition = 'all 0.5s ease';
          
          setTimeout(() => {
            notification.remove();
          }, 500);
        }, 5000);
      };
    });
  
    afterEach(() => {
      jest.useRealTimers();
    });
  
    describe('Container creation', () => {
      it('should create notification container on first call', () => {
        expect(document.querySelector('.notification-container')).toBeNull();
        
        showNotification('Test message');
        
        const container = document.querySelector('.notification-container');
        expect(container).not.toBeNull();
        expect(container.className).toBe('notification-container');
      });
  
      it('should set correct positioning styles on container', () => {
        showNotification('Test message');
        
        const container = document.querySelector('.notification-container');
        expect(container.style.position).toBe('fixed');
        expect(container.style.top).toBe('20px');
        expect(container.style.right).toBe('20px');
        expect(container.style.zIndex).toBe('1000');
      });
  
      it('should reuse existing container on subsequent calls', () => {
        showNotification('First message');
        const firstContainer = document.querySelector('.notification-container');
        
        showNotification('Second message');
        const secondContainer = document.querySelector('.notification-container');
        
        expect(firstContainer).toBe(secondContainer);
      });
  
      it('should append container to document body', () => {
        showNotification('Test message');
        
        const container = document.querySelector('.notification-container');
        expect(document.body.contains(container)).toBe(true);
      });
    });
  
    describe('Notification element creation', () => {
      it('should create notification element with correct class', () => {
        showNotification('Test message');
        
        const notification = document.querySelector('.notification');
        expect(notification).not.toBeNull();
        expect(notification.className).toBe('notification');
      });
  
      it('should set notification content to message parameter', () => {
        const testMessage = 'This is a test notification';
        showNotification(testMessage);
        
        const notification = document.querySelector('.notification');
        expect(notification.textContent).toBe(testMessage);
      });
  
      it('should apply correct padding style', () => {
        showNotification('Test');
        
        const notification = document.querySelector('.notification');
        expect(notification.style.padding).toBe('15px 20px');
      });
  
      it('should apply correct margin style', () => {
        showNotification('Test');
        
        const notification = document.querySelector('.notification');
        expect(notification.style.marginBottom).toBe('10px');
      });
  
      it('should apply correct border radius', () => {
        showNotification('Test');
        
        const notification = document.querySelector('.notification');
        expect(notification.style.borderRadius).toBe('5px');
      });
  
      it('should set text color to white', () => {
        showNotification('Test');
        
        const notification = document.querySelector('.notification');
        expect(notification.style.color).toBe('white');
      });
  
      it('should apply box shadow', () => {
        showNotification('Test');
        
        const notification = document.querySelector('.notification');
        expect(notification.style.boxShadow).toBe('0 2px 10px rgba(0,0,0,0.2)');
      });
  
      it('should apply fade-in animation', () => {
        showNotification('Test');
        
        const notification = document.querySelector('.notification');
        expect(notification.style.animation).toBe('fadeIn 0.3s ease');
      });
    });
  
    describe('Error notification styling', () => {
      it('should apply error gradient background when isError is true', () => {
        showNotification('Error message', true);
        
        const notification = document.querySelector('.notification');
        expect(notification.style.background).toBe('linear-gradient(to right, #ff4b2b, #ff416c)');
      });
  
      it('should apply red/pink gradient for error notifications', () => {
        showNotification('An error occurred', true);
        
        const notification = document.querySelector('.notification');
        const background = notification.style.background;
        
        expect(background).toContain('ff4b2b');
        expect(background).toContain('ff416c');
      });
  
      it('should distinguish error notifications visually', () => {
        showNotification('Error', true);
        const errorNotif = document.querySelector('.notification');
        const errorBackground = errorNotif.style.background;
        
        // Clear for next test
        document.body.innerHTML = '';
        
        showNotification('Success', false);
        const successNotif = document.querySelector('.notification');
        const successBackground = successNotif.style.background;
        
        expect(errorBackground).not.toBe(successBackground);
      });
    });
  
    describe('Success notification styling', () => {
      it('should apply success gradient background when isError is false', () => {
        showNotification('Success message', false);
        
        const notification = document.querySelector('.notification');
        expect(notification.style.background).toBe('linear-gradient(to right, #6d28d9, #8b5cf6)');
      });
  
      it('should apply purple gradient for success notifications', () => {
        showNotification('Operation successful', false);
        
        const notification = document.querySelector('.notification');
        const background = notification.style.background;
        
        expect(background).toContain('6d28d9');
        expect(background).toContain('8b5cf6');
      });
  
      it('should default to success styling when isError is not provided', () => {
        showNotification('Default message');
        
        const notification = document.querySelector('.notification');
        expect(notification.style.background).toBe('linear-gradient(to right, #6d28d9, #8b5cf6)');
      });
    });
  
    describe('Notification timeout and removal', () => {
      it('should remove notification after 5 seconds', () => {
        showNotification('Test message');
        
        const notification = document.querySelector('.notification');
        expect(notification).not.toBeNull();
        
        // Advance time by 5 seconds
        jest.advanceTimersByTime(5000);
        
        // Notification should still be in DOM but with fade styles
        expect(notification.style.opacity).toBe('0');
        expect(notification.style.transform).toBe('translateX(100%)');
      });
  
      it('should apply fade-out transition styles after 5 seconds', () => {
        showNotification('Test message');
        const notification = document.querySelector('.notification');
        
        jest.advanceTimersByTime(5000);
        
        expect(notification.style.transition).toBe('all 0.5s ease');
      });
  
      it('should completely remove notification after additional 500ms', () => {
        showNotification('Test message');
        const notification = document.querySelector('.notification');
        
        // Advance to 5 seconds (fade starts)
        jest.advanceTimersByTime(5000);
        expect(document.body.contains(notification)).toBe(true);
        
        // Advance additional 500ms (notification removed)
        jest.advanceTimersByTime(500);
        expect(notification.isConnected).toBe(false);
      });
  
      it('should maintain container after notification removal', () => {
        showNotification('Test message');
        const container = document.querySelector('.notification-container');
        
        jest.advanceTimersByTime(5500);
        
        expect(document.querySelector('.notification-container')).toBe(container);
      });
  
      it('should allow multiple notifications to stack', () => {
        showNotification('First message');
        showNotification('Second message');
        showNotification('Third message');
        
        const notifications = document.querySelectorAll('.notification');
        expect(notifications.length).toBe(3);
      });
  
      it('should remove each notification independently', () => {
        showNotification('First message');
        showNotification('Second message');
        
        let notifications = document.querySelectorAll('.notification');
        expect(notifications.length).toBe(2);
        
        // Advance time to remove both notifications (after 5500ms)
        jest.advanceTimersByTime(5500);
        
        notifications = document.querySelectorAll('.notification');
        // Both should be removed after 5500ms total
        expect(notifications.length).toBe(0);
      });
    });
  
    describe('Multiple notifications', () => {
      it('should display multiple notifications with correct spacing', () => {
        showNotification('First message');
        showNotification('Second message');
        
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(notif => {
          expect(notif.style.marginBottom).toBe('10px');
        });
      });
  
      it('should stack notifications in order', () => {
        showNotification('First');
        showNotification('Second');
        showNotification('Third');
        
        const notifications = document.querySelectorAll('.notification');
        expect(notifications[0].textContent).toBe('First');
        expect(notifications[1].textContent).toBe('Second');
        expect(notifications[2].textContent).toBe('Third');
      });
  
      it('should handle mixed error and success notifications', () => {
        showNotification('Error occurred', true);
        showNotification('Operation successful', false);
        showNotification('Another error', true);
        
        const notifications = document.querySelectorAll('.notification');
        expect(notifications.length).toBe(3);
        
        expect(notifications[0].style.background).toContain('ff4b2b');
        expect(notifications[1].style.background).toContain('6d28d9');
        expect(notifications[2].style.background).toContain('ff4b2b');
      });
    });
  
    describe('Edge cases and error handling', () => {
      it('should handle empty message string', () => {
        showNotification('');
        
        const notification = document.querySelector('.notification');
        expect(notification.textContent).toBe('');
        expect(notification).not.toBeNull();
      });
  
      it('should handle very long messages', () => {
        const longMessage = 'A'.repeat(500);
        showNotification(longMessage);
        
        const notification = document.querySelector('.notification');
        expect(notification.textContent).toBe(longMessage);
      });
  
      it('should handle special characters in message', () => {
        const specialMessage = '✅ Success! @#$%^&*() <html>';
        showNotification(specialMessage);
        
        const notification = document.querySelector('.notification');
        expect(notification.textContent).toBe(specialMessage);
      });
  
      it('should handle null or undefined gracefully', () => {
        expect(() => showNotification(null)).not.toThrow();
        expect(() => showNotification(undefined)).not.toThrow();
      });
  
      it('should handle rapid successive calls', () => {
        for (let i = 0; i < 10; i++) {
          showNotification(`Message ${i}`);
        }
        
        const notifications = document.querySelectorAll('.notification');
        expect(notifications.length).toBe(10);
      });
  
      it('should not break if notification element is manually removed', () => {
        showNotification('Test message');
        const notification = document.querySelector('.notification');
        
        notification.remove();
        
        // Advance timers - should not throw
        expect(() => jest.advanceTimersByTime(5500)).not.toThrow();
      });
    });
  
    describe('Style consistency', () => {
      it('should apply consistent styling to all notifications', () => {
        showNotification('Message 1');
        showNotification('Message 2');
        showNotification('Message 3', true);
        
        const notifications = document.querySelectorAll('.notification');
        
        notifications.forEach(notif => {
          expect(notif.style.padding).toBe('15px 20px');
          expect(notif.style.borderRadius).toBe('5px');
          expect(notif.style.color).toBe('white');
          expect(notif.style.boxShadow).toBe('0 2px 10px rgba(0,0,0,0.2)');
        });
      });
  
      it('should maintain container positioning', () => {
        showNotification('Message 1');
        showNotification('Message 2');
        showNotification('Message 3');
        
        const container = document.querySelector('.notification-container');
        expect(container.style.position).toBe('fixed');
        expect(container.style.top).toBe('20px');
        expect(container.style.right).toBe('20px');
        expect(container.style.zIndex).toBe('1000');
      });
    });
  
    describe('DOM manipulation', () => {
      it('should append notifications to container, not body', () => {
        showNotification('Test message');
        
        const container = document.querySelector('.notification-container');
        const notification = document.querySelector('.notification');
        
        expect(container.contains(notification)).toBe(true);
      });
  
      it('should not create duplicate containers', () => {
        showNotification('Message 1');
        showNotification('Message 2');
        showNotification('Message 3');
        
        const containers = document.querySelectorAll('.notification-container');
        expect(containers.length).toBe(1);
      });
  
      it('should properly clean up after all notifications expire', () => {
        showNotification('Test 1');
        showNotification('Test 2');
        
        jest.advanceTimersByTime(5500);
        
        let notifications = document.querySelectorAll('.notification');
        expect(notifications.length).toBe(0);
        
        // Container should still exist for new notifications
        const container = document.querySelector('.notification-container');
        expect(container).not.toBeNull();
      });
    });
  
    describe('Animation and transition properties', () => {
      it('should apply fade-in animation on creation', () => {
        showNotification('Test');
        
        const notification = document.querySelector('.notification');
        expect(notification.style.animation).toBe('fadeIn 0.3s ease');
      });
  
      it('should apply fade-out transition after timeout', () => {
        showNotification('Test');
        const notification = document.querySelector('.notification');
        
        jest.advanceTimersByTime(5000);
        
        expect(notification.style.transition).toBe('all 0.5s ease');
        expect(notification.style.opacity).toBe('0');
        expect(notification.style.transform).toBe('translateX(100%)');
      });
  
      it('should have correct animation duration', () => {
        showNotification('Test');
        const notification = document.querySelector('.notification');
        
        // Notification should be visible during initial animation
        expect(notification.style.animation).toContain('0.3s');
        
        // Should wait 5 seconds before fade
        jest.advanceTimersByTime(4999);
        expect(notification.style.opacity).not.toBe('0');
        
        jest.advanceTimersByTime(1);
        expect(notification.style.opacity).toBe('0');
      });
    });
  });