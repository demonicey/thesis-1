const express = require('express');
const router = express.Router();
const Game = require('../models/Game');

// Middleware to check if logged in
function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
}

// Generate a basic Sudoku board (simplified)
function generateSudoku() {
  // Placeholder: return a fixed board for now
  const board = [
    [5,3,0,0,7,0,0,0,0],
    [6,0,0,1,9,5,0,0,0],
    [0,9,8,0,0,0,0,6,0],
    [8,0,0,0,6,0,0,0,3],
    [4,0,0,8,0,3,0,0,1],
    [7,0,0,0,2,0,0,0,6],
    [0,6,0,0,0,0,2,8,0],
    [0,0,0,4,1,9,0,0,5],
    [0,0,0,0,8,0,0,7,9]
  ];
  const solution = [
    [5,3,4,6,7,8,9,1,2],
    [6,7,2,1,9,5,3,4,8],
    [1,9,8,3,4,2,5,6,7],
    [8,5,9,7,6,1,4,2,3],
    [4,2,6,8,5,3,7,9,1],
    [7,1,3,9,2,4,8,5,6],
    [9,6,1,5,3,7,2,8,4],
    [2,8,7,4,1,9,6,3,5],
    [3,4,5,2,8,6,1,7,9]
  ];
  return { board, solution };
}

// Start a new game
router.post('/start', requireAuth, (req, res) => {
  const { latitude, longitude } = req.body;
  const { board, solution } = generateSudoku();
  const game = new Game(req.session.userId, JSON.stringify(board), JSON.stringify(solution), latitude, longitude);

  game.save((err, id) => {
    if (err) return res.status(500).json({ error: 'Failed to start game' });
    res.json({ gameId: id, board });
  });
});

// Submit move
router.post('/move', requireAuth, (req, res) => {
  const { gameId, row, col, value } = req.body;
  // Basic validation: check if move is valid
  Game.findById(gameId, (err, game) => {
    if (err || !game) return res.status(404).json({ error: 'Game not found' });
    const solution = JSON.parse(game.solution);
    if (solution[row][col] === value) {
      res.json({ valid: true });
    } else {
      res.json({ valid: false });
    }
  });
});

// Complete game
router.post('/complete', requireAuth, (req, res) => {
  const { gameId, score } = req.body;
  Game.updateScore(gameId, score, (err) => {
    if (err) return res.status(500).json({ error: 'Failed to update score' });
    res.json({ message: 'Game completed' });
  });
});

// Get user games
router.get('/history', requireAuth, (req, res) => {
  Game.findByUserId(req.session.userId, (err, games) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch games' });
    res.json(games);
  });
});

module.exports = router;
