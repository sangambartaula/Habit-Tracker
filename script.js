document.addEventListener("DOMContentLoaded", () => {
    console.log("Script loaded");
    
    // Check if we're on the welcome page - if so, don't run this script
    if (window.isWelcomePage) {
      console.log("Welcome page detected, skipping main script");
      return;
    }
    
    // Get current page path
    const currentPath = window.location.pathname;
    console.log("Current path:", currentPath);
    
    // Show notification function
    function showNotification(message, isError = false) {
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
    }
  
    // 👉 Handle Sign-Up
    const signupForm = document.getElementById("signup-form");
    if (signupForm) {
        console.log("Signup form detected");
        signupForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            console.log("Signup form submitted");
            
            // Disable submit button
            const submitBtn = signupForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Creating account...';
    
            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirm-password").value;
    
            if (password !== confirmPassword) {
                showNotification("Passwords do not match.", true);
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                return;
            }
    
            try {
                console.log("Sending signup request");
                const res = await fetch("http://localhost:5000/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password })
                });
    
                const data = await res.json();
                console.log("Signup response:", data);
                
                if (res.ok) {
                    showNotification("✅ Sign-up successful! Redirecting to sign-in...");
                    setTimeout(() => {
                        window.location.href = "signin.html";
                    }, 2000);
                } else {
                    showNotification(data.message || "Sign-up failed.", true);
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
            } catch (err) {
                console.error("Signup error:", err);
                showNotification("Server error. Please check if the server is running.", true);
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }
  
    // 👉 Handle Sign-In
    const signinForm = document.getElementById("signin-form");
    if (signinForm) {
        console.log("Signin form detected");
        signinForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            console.log("Signin form submitted");
            
            // Disable submit button
            const submitBtn = signinForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Signing in...';
    
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
    
            try {
                console.log("Sending signin request");
                const res = await fetch("http://localhost:5000/signin", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });
    
                const data = await res.json();
                console.log("Signin response:", data);
                
                if (res.ok) {
                    showNotification("✅ Login successful! Redirecting...");
                    localStorage.setItem("isLoggedIn", "true");
                    localStorage.setItem("userEmail", email);
                    if (data.user && data.user.name) {
                        localStorage.setItem("userName", data.user.name);
                    }
                    
                    setTimeout(() => {
                        window.location.href = "index.html";
                    }, 1500);
                } else {
                    showNotification(data.message || "Invalid email or password.", true);
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
            } catch (err) {
                console.error("Signin error:", err);
                showNotification("Server error. Please check if the server is running.", true);
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }
  
    // 🔐 Auth gate (if user not logged in, redirect from index)
    if (currentPath.includes("index.html") && localStorage.getItem("isLoggedIn") !== "true") {
        console.log("User not logged in, redirecting from index to signin");
        window.location.href = "signin.html";
    }
    
    // Add logout functionality to logout button
    const logoutBtn = document.querySelector('a[href="welcome.html"].cta-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
  });
  
  // 🔓 Logout function
  function logout() {
    console.log("Logging out");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    window.location.href = "welcome.html";
  }
  
  // Add CSS for notifications
  document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateX(100%); }
            to { opacity: 1; transform: translateX(0); }
        }
        
        .notification-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
        }
        
        .notification {
            padding: 15px 20px;
            margin-bottom: 10px;
            border-radius: 5px;
            color: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            animation: fadeIn 0.3s ease;
        }
    `;
    document.head.appendChild(style);
  });