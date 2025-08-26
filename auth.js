// auth.js - Complete server file for Habit Tracker application
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path');
require("dotenv").config();

// Import User model
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use(express.json());

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Root route - explicitly serve welcome.html
app.get('/', (req, res) => {
  console.log('Root route accessed - serving welcome.html');
  console.log('Full path:', path.join(__dirname, 'welcome.html'));
  res.sendFile(path.join(__dirname, 'welcome.html'));
});

// Specific routes for HTML files
app.get('/welcome.html', (req, res) => {
  console.log('Serving welcome.html');
  res.sendFile(path.join(__dirname, 'welcome.html'));
});

app.get('/index.html', (req, res) => {
  console.log('Serving index.html');
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/signup.html', (req, res) => {
  console.log('Serving signup.html');
  res.sendFile(path.join(__dirname, 'signup.html'));
});

app.get('/signin.html', (req, res) => {
  console.log('Serving signin.html');
  res.sendFile(path.join(__dirname, 'signin.html'));
});

// ADD THESE NEW ROUTES FOR GOAL TRACKER
app.get('/goal_tracker.html', (req, res) => {
  console.log('Serving goal_tracker.html');
  res.sendFile(path.join(__dirname, 'goal_tracker.html'));
});

app.get('/goal_tracker.js', (req, res) => {
  console.log('Serving goal_tracker.js');
  res.sendFile(path.join(__dirname, 'goal_tracker.js'));
});

app.get('/goal_tracker.css', (req, res) => {
  console.log('Serving goal_tracker.css');
  res.sendFile(path.join(__dirname, 'goal_tracker.css'));
});

app.get('/notifications.js', (req, res) => {
  console.log('Serving notifications.js');
  res.sendFile(path.join(__dirname, 'notifications.js'));
});

// Route for welcome.js - our special script for the welcome page
app.get('/welcome.js', (req, res) => {
  console.log('Serving welcome.js');
  res.sendFile(path.join(__dirname, 'welcome.js'));
});

// Add diagnostic route
app.get('/diagnose.js', (req, res) => {
  console.log('Serving diagnose.js');
  const diagnoseScript = `
    console.log('Diagnostic script loaded successfully!');

    document.addEventListener('DOMContentLoaded', () => {
      // Create diagnostic panel
      const panel = document.createElement('div');
      panel.style.position = 'fixed';
      panel.style.top = '10px';
      panel.style.right = '10px';
      panel.style.backgroundColor = 'rgba(0,0,0,0.8)';
      panel.style.color = 'white';
      panel.style.padding = '15px';
      panel.style.borderRadius = '5px';
      panel.style.zIndex = '9999';
      panel.style.maxWidth = '400px';
      panel.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
      
      // Add diagnostic info
      panel.innerHTML = \`
        <h3 style="margin-top:0;color:#8b5cf6">Diagnostic Info</h3>
        <p><strong>Page URL:</strong> \${window.location.href}</p>
        <p><strong>Scripts loaded:</strong></p>
        <ul id="scripts-list" style="padding-left:20px;margin-bottom:10px"></ul>
        <p><strong>CSS loaded:</strong></p>
        <ul id="css-list" style="padding-left:20px;margin-bottom:10px"></ul>
        <button id="check-files" style="background:#8b5cf6;color:white;border:none;padding:5px 10px;border-radius:5px;cursor:pointer;margin-right:5px">Check Files</button>
        <button id="close-panel" style="background:#4b5563;color:white;border:none;padding:5px 10px;border-radius:5px;cursor:pointer">Close</button>
      \`;
      
      document.body.appendChild(panel);
      
      // List all scripts
      const scriptsList = document.getElementById('scripts-list');
      document.querySelectorAll('script').forEach(script => {
        const li = document.createElement('li');
        li.textContent = script.src || 'Inline script';
        li.style.color = script.src ? '#10b981' : '#f59e0b';
        scriptsList.appendChild(li);
      });
      
      // List all CSS
      const cssList = document.getElementById('css-list');
      document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
        const li = document.createElement('li');
        li.textContent = link.href;
        li.style.color = '#10b981';
        cssList.appendChild(li);
      });
      
      // Add check files button functionality
      document.getElementById('check-files').addEventListener('click', () => {
        const filesToCheck = [
          'goal_tracker.css',
          'goal_tracker.js',
          'notifications.js'
        ];
        
        filesToCheck.forEach(file => {
          fetch(file)
            .then(response => {
              const li = document.createElement('li');
              li.textContent = \`\${file}: \${response.ok ? 'Found ✅' : 'Not found ❌'} (\${response.status})\`;
              li.style.color = response.ok ? '#10b981' : '#ef4444';
              document.getElementById('scripts-list').appendChild(li);
            })
            .catch(error => {
              const li = document.createElement('li');
              li.textContent = \`\${file}: Error ❌ (\${error.message})\`;
              li.style.color = '#ef4444';
              document.getElementById('scripts-list').appendChild(li);
            });
        });
      });
      
      // Add close button functionality
      document.getElementById('close-panel').addEventListener('click', () => {
        panel.style.display = 'none';
      });
    });
  `;
  res.setHeader('Content-Type', 'application/javascript');
  res.send(diagnoseScript);
});

// File check endpoint (for diagnostics)
app.get('/check-files', (req, res) => {
  const files = [
    'goal_tracker.html',
    'goal_tracker.css',
    'goal_tracker.js',
    'notifications.js'
  ];
  
  const results = {};
  
  files.forEach(file => {
    try {
      const filePath = path.join(__dirname, file);
      const exists = require('fs').existsSync(filePath);
      results[file] = {
        exists,
        path: filePath
      };
    } catch (error) {
      results[file] = {
        exists: false,
        error: error.message
      };
    }
  });
  
  res.json(results);
});

// Serve static files for CSS, JS, images, etc.
// IMPORTANT: This comes AFTER our specific routes
app.use(express.static(path.join(__dirname), {
  index: false // This prevents Express from automatically serving index.html
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Sign Up
app.post('/signup', async (req, res) => {
  console.log('Received signup request:', req.body);
  
  try {
    const { name, email, password } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      console.log('Missing required fields');
      return res.status(400).json({ message: "All fields are required" });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = new User({ 
      name, 
      email, 
      password: hashedPassword 
    });

    await newUser.save();
    console.log('User created successfully:', email);
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error during sign-up" });
  }
});

// Sign In
app.post('/signin', async (req, res) => {
  console.log('Received signin request for:', req.body.email);
  
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for:', email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log('Login successful for:', email);
    res.status(200).json({ 
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({ message: "Server error during sign-in" });
  }
});

// Catch-all route for any other requests
app.use((req, res) => {
  console.log('404 - Not found:', req.path);
  res.status(404).send('Page not found');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: "Server error. Please try again later." });
});

// MongoDB connection with better error handling
console.log('Connecting to MongoDB...');
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/habit-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ MongoDB connected successfully");
  
  // Start Server AFTER successful MongoDB connection
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 API endpoints available at:`);
    console.log(`   - POST http://localhost:${PORT}/signup`);
    console.log(`   - POST http://localhost:${PORT}/signin`);
    console.log(`   - GET http://localhost:${PORT}/health`);
    console.log(`   - GET http://localhost:${PORT}/goal_tracker.html`);
  });
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err);
  console.error("Server not started due to database connection failure");
});