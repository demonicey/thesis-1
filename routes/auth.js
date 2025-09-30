const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register
router.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  User.findByUsername(username, (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (user) return res.status(400).json({ error: 'Username exists' });

    User.create(username, password, (err, id) => {
      if (err) return res.status(500).json({ error: 'Registration failed' });
      res.json({ message: 'User registered', id });
    });
  });
});

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  User.findByUsername(username, (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.userId = user.id;
    res.json({ message: 'Logged in', userId: user.id });
  });
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.json({ message: 'Logged out' });
  });
});

module.exports = router;
