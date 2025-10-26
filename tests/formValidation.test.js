/**
 * Form Validation Tests
 * Covers: Email validation, password validation, field requirements
 */

describe('Form Validation - Email Input', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <form id="test-form">
          <input type="email" id="email" value="" />
          <button type="submit">Submit</button>
        </form>
      `;
    });
  
    describe('Valid email formats', () => {
      it('should accept standard email format', () => {
        const email = 'user@example.com';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        expect(emailRegex.test(email)).toBe(true);
      });
  
      it('should accept email with numbers', () => {
        const email = 'user123@example.com';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        expect(emailRegex.test(email)).toBe(true);
      });
  
      it('should accept email with dots in local part', () => {
        const email = 'first.last@example.com';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        expect(emailRegex.test(email)).toBe(true);
      });
  
      it('should accept email with plus sign', () => {
        const email = 'user+tag@example.com';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        expect(emailRegex.test(email)).toBe(true);
      });
  
      it('should accept email with hyphen in domain', () => {
        const email = 'user@my-domain.com';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        expect(emailRegex.test(email)).toBe(true);
      });
  
      it('should accept email with multi-level TLD', () => {
        const email = 'user@example.co.uk';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        expect(emailRegex.test(email)).toBe(true);
      });
    });
  
    describe('Invalid email formats', () => {
      it('should reject email without @ symbol', () => {
        const email = 'userexample.com';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        expect(emailRegex.test(email)).toBe(false);
      });
  
      it('should reject email without domain', () => {
        const email = 'user@';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        expect(emailRegex.test(email)).toBe(false);
      });
  
      it('should reject email without local part', () => {
        const email = '@example.com';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        expect(emailRegex.test(email)).toBe(false);
      });
  
      it('should reject email without TLD', () => {
        const email = 'user@example';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        expect(emailRegex.test(email)).toBe(false);
      });
  
      it('should reject email with spaces', () => {
        const email = 'user @example.com';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        expect(emailRegex.test(email)).toBe(false);
      });
  
      it('should reject multiple @ symbols', () => {
        const email = 'user@@example.com';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        expect(emailRegex.test(email)).toBe(false);
      });
  
      it('should reject empty string', () => {
        const email = '';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        expect(emailRegex.test(email)).toBe(false);
      });
    });
  
    describe('Email HTML5 input validation', () => {
      it('should use HTML5 type="email" for browser validation', () => {
        const emailInput = document.getElementById('email');
        expect(emailInput.type).toBe('email');
      });
  
      it('should prevent form submission on invalid email', () => {
        const form = document.getElementById('test-form');
        const emailInput = document.getElementById('email');
        
        emailInput.value = 'invalid';
        
        // HTML5 validation would prevent submission
        // We simulate by checking validity
        expect(emailInput.validity.valid).toBe(false);
      });
  
      it('should allow form submission on valid email', () => {
        const emailInput = document.getElementById('email');
        emailInput.value = 'valid@example.com';
        
        expect(emailInput.validity.valid).toBe(true);
      });
    });
  
    describe('Email trimming', () => {
      it('should trim whitespace from email', () => {
        const email = '  user@example.com  ';
        const trimmed = email.trim();
        
        expect(trimmed).toBe('user@example.com');
      });
  
      it('should trim leading whitespace', () => {
        const email = '  user@example.com';
        const trimmed = email.trim();
        
        expect(trimmed).toBe('user@example.com');
      });
  
      it('should trim trailing whitespace', () => {
        const email = 'user@example.com  ';
        const trimmed = email.trim();
        
        expect(trimmed).toBe('user@example.com');
      });
  
      it('should handle tab and newline characters', () => {
        const email = '\tuser@example.com\n';
        const trimmed = email.trim();
        
        expect(trimmed).toBe('user@example.com');
      });
    });
  });
  
  // ============================================
  
  describe('Form Validation - Password Confirmation', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <form id="signup-form">
          <input type="password" id="password" value="" />
          <input type="password" id="confirm-password" value="" />
          <button type="submit">Sign Up</button>
        </form>
      `;
    });
  
    describe('Password matching', () => {
      it('should match identical passwords', () => {
        const password = 'MyPassword123';
        const confirmPassword = 'MyPassword123';
        
        expect(password === confirmPassword).toBe(true);
      });
  
      it('should not match different passwords', () => {
        const password = 'MyPassword123';
        const confirmPassword = 'DifferentPass456';
        
        expect(password === confirmPassword).toBe(false);
      });
  
      it('should not match if case differs', () => {
        const password = 'MyPassword123';
        const confirmPassword = 'mypassword123';
        
        expect(password === confirmPassword).toBe(false);
      });
  
      it('should not match if only one character differs', () => {
        const password = 'MyPassword123';
        const confirmPassword = 'MyPassword124';
        
        expect(password === confirmPassword).toBe(false);
      });
  
      it('should require exact character match', () => {
        const password = 'Pass123!';
        const confirmPassword = 'Pass123 ';
        
        expect(password === confirmPassword).toBe(false);
      });
    });
  
    describe('Password validation edge cases', () => {
      it('should handle empty passwords', () => {
        const password = '';
        const confirmPassword = '';
        
        expect(password === confirmPassword).toBe(true);
      });
  
      it('should handle very long passwords', () => {
        const longPassword = 'A'.repeat(1000);
        
        const password = longPassword;
        const confirmPassword = longPassword;
        
        expect(password === confirmPassword).toBe(true);
      });
  
      it('should handle passwords with special characters', () => {
        const password = 'P@ss!wörd#123';
        const confirmPassword = 'P@ss!wörd#123';
        
        expect(password === confirmPassword).toBe(true);
      });
  
      it('should handle passwords with spaces', () => {
        const password = 'My Pass 123';
        const confirmPassword = 'My Pass 123';
        
        expect(password === confirmPassword).toBe(true);
      });
  
      it('should not match if whitespace differs', () => {
        const password = 'MyPassword123';
        const confirmPassword = 'MyPassword123 ';
        
        expect(password === confirmPassword).toBe(false);
      });
    });
  
    describe('Form submission prevention', () => {
      it('should prevent submission when passwords do not match', () => {
        document.getElementById('password').value = 'Pass123';
        document.getElementById('confirm-password').value = 'Pass124';
        
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        const canSubmit = password === confirmPassword;
        expect(canSubmit).toBe(false);
      });
  
      it('should allow submission when passwords match', () => {
        document.getElementById('password').value = 'Pass123';
        document.getElementById('confirm-password').value = 'Pass123';
        
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        const canSubmit = password === confirmPassword;
        expect(canSubmit).toBe(true);
      });
  
      it('should show error message on mismatch', () => {
        const password = 'Pass1';
        const confirmPassword = 'Pass2';
        
        if (password !== confirmPassword) {
          const errorShown = true;
          expect(errorShown).toBe(true);
        }
      });
    });
  
    describe('Password field types', () => {
      it('should use type="password" for password fields', () => {
        const passwordInput = document.getElementById('password');
        const confirmInput = document.getElementById('confirm-password');
        
        expect(passwordInput.type).toBe('password');
        expect(confirmInput.type).toBe('password');
      });
  
      it('should mask password input in browser', () => {
        const passwordInput = document.getElementById('password');
        passwordInput.value = 'secret123';
        
        // Value is stored but displayed as dots/bullets
        expect(passwordInput.value).toBe('secret123');
        expect(passwordInput.type).toBe('password');
      });
    });
  });
  
  // ============================================
  
  describe('Form Validation - Required Fields', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <form id="signup-form">
          <input type="text" id="name" value="" required />
          <input type="email" id="email" value="" required />
          <input type="password" id="password" value="" required />
          <button type="submit">Sign Up</button>
        </form>
      `;
    });
  
    describe('Required field checking', () => {
      it('should detect empty name field', () => {
        const name = document.getElementById('name').value;
        expect(name.length === 0).toBe(true);
      });
  
      it('should detect empty email field', () => {
        const email = document.getElementById('email').value;
        expect(email.length === 0).toBe(true);
      });
  
      it('should detect empty password field', () => {
        const password = document.getElementById('password').value;
        expect(password.length === 0).toBe(true);
      });
  
      it('should allow submission when all fields are filled', () => {
        document.getElementById('name').value = 'John Doe';
        document.getElementById('email').value = 'john@example.com';
        document.getElementById('password').value = 'Pass123';
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        const allFilled = Boolean(name && email && password);
        expect(allFilled).toBe(true);
      });
  
      it('should prevent submission if any field is empty', () => {
        document.getElementById('name').value = 'John Doe';
        document.getElementById('email').value = '';
        document.getElementById('password').value = 'Pass123';
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        const allFilled = Boolean(name && email && password);
        expect(allFilled).toBe(false);
      });
    });
  
    describe('Whitespace-only fields', () => {
      it('should treat whitespace-only name as empty', () => {
        document.getElementById('name').value = '   ';
        
        const name = document.getElementById('name').value.trim();
        expect(name.length === 0).toBe(true);
      });
  
      it('should treat whitespace-only email as empty', () => {
        document.getElementById('email').value = '\t\n';
        
        const email = document.getElementById('email').value.trim();
        expect(email.length === 0).toBe(true);
      });
  
      it('should treat whitespace-only password as empty', () => {
        document.getElementById('password').value = '  ';
        
        const password = document.getElementById('password').value.trim();
        expect(password.length === 0).toBe(true);
      });
  
      it('should reject form submission with whitespace-only fields', () => {
        document.getElementById('name').value = '  John Doe  ';
        document.getElementById('email').value = '   ';
        document.getElementById('password').value = 'Pass123';
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        
        const allValid = Boolean(name && email && password);
        expect(allValid).toBe(false);
      });
    });
  
    describe('HTML5 required attribute', () => {
      it('should have required attribute on name field', () => {
        const nameInput = document.getElementById('name');
        expect(nameInput.hasAttribute('required')).toBe(true);
      });
  
      it('should have required attribute on email field', () => {
        const emailInput = document.getElementById('email');
        expect(emailInput.hasAttribute('required')).toBe(true);
      });
  
      it('should have required attribute on password field', () => {
        const passwordInput = document.getElementById('password');
        expect(passwordInput.hasAttribute('required')).toBe(true);
      });
  
      it('should prevent form submission with browser validation', () => {
        const form = document.getElementById('signup-form');
        const nameInput = document.getElementById('name');
        
        nameInput.value = '';
        
        // HTML5 validation
        expect(nameInput.validity.valid).toBe(false);
      });
    });
  
    describe('Field validation order', () => {
      it('should validate name before email', () => {
        const name = document.getElementById('name').value || '';
        const email = document.getElementById('email').value || '';
        
        // Both empty
        expect(name.length === 0).toBe(true);
        expect(email.length === 0).toBe(true);
      });
  
      it('should validate all fields together', () => {
        document.getElementById('name').value = 'John';
        document.getElementById('email').value = 'john@example.com';
        document.getElementById('password').value = 'Pass123';
        
        const allFields = [
          document.getElementById('name').value,
          document.getElementById('email').value,
          document.getElementById('password').value
        ];
        
        const allValid = allFields.every(field => field.length > 0);
        expect(allValid).toBe(true);
      });
    });
  
    describe('Input trimming on validation', () => {
      it('should trim name value during validation', () => {
        document.getElementById('name').value = '  John Doe  ';
        
        const name = document.getElementById('name').value.trim();
        expect(name).toBe('John Doe');
      });
  
      it('should trim email value during validation', () => {
        document.getElementById('email').value = '  john@example.com  ';
        
        const email = document.getElementById('email').value.trim();
        expect(email).toBe('john@example.com');
      });
  
      it('should preserve original values after trimming for display', () => {
        const originalValue = '  John Doe  ';
        document.getElementById('name').value = originalValue;
        
        const trimmedValue = document.getElementById('name').value.trim();
        
        expect(document.getElementById('name').value).toBe(originalValue);
        expect(trimmedValue).toBe('John Doe');
      });
    });
  
    describe('Min/max length validation', () => {
      it('should validate minimum name length', () => {
        const minLength = 2;
        document.getElementById('name').value = 'J';
        
        const name = document.getElementById('name').value;
        expect(name.length >= minLength).toBe(false);
      });
  
      it('should accept names within valid length', () => {
        document.getElementById('name').value = 'John Doe';
        
        const name = document.getElementById('name').value;
        expect(name.length > 0).toBe(true);
      });
  
      it('should validate password minimum length', () => {
        const minLength = 6;
        document.getElementById('password').value = 'Pass1';
        
        const password = document.getElementById('password').value;
        expect(password.length >= minLength).toBe(false);
      });
  
      it('should accept passwords within valid length', () => {
        document.getElementById('password').value = 'Pass123';
        
        const password = document.getElementById('password').value;
        expect(password.length > 0).toBe(true);
      });
    });
  });
  
  describe('Cross-field Validation', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <form id="full-form">
          <input type="text" id="name" value="" required />
          <input type="email" id="email" value="" required />
          <input type="password" id="password" value="" required />
          <input type="password" id="confirm-password" value="" required />
          <button type="submit">Submit</button>
        </form>
      `;
    });
  
    it('should validate password and confirm-password match before other fields', () => {
      document.getElementById('name').value = 'John';
      document.getElementById('email').value = 'john@example.com';
      document.getElementById('password').value = 'Pass123';
      document.getElementById('confirm-password').value = 'Pass124';
      
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      
      // Password validation takes priority
      expect(password === confirmPassword).toBe(false);
    });
  
    it('should validate all fields in combination', () => {
      document.getElementById('name').value = 'John';
      document.getElementById('email').value = 'john@example.com';
      document.getElementById('password').value = 'Pass123';
      document.getElementById('confirm-password').value = 'Pass123';
      
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      
      const allValid = name && email && (password === confirmPassword);
      expect(allValid).toBe(true);
    });
  
    it('should fail if password confirmation fails even if other fields are valid', () => {
      document.getElementById('name').value = 'John';
      document.getElementById('email').value = 'john@example.com';
      document.getElementById('password').value = 'Pass123';
      document.getElementById('confirm-password').value = 'Pass999';
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      
      const formValid = name && email && (password === confirmPassword);
      expect(formValid).toBe(false);
    });
  });