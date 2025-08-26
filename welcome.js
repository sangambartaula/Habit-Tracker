// This script runs only on the welcome page
console.log("Welcome page script loaded");

// Clear any localStorage that might cause redirects
localStorage.removeItem("isLoggedIn");
localStorage.removeItem("userEmail");
localStorage.removeItem("userName");

// Prevent script.js from running on this page
window.isWelcomePage = true;

console.log("Welcome page: localStorage cleared");