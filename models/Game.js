const db = require('../database/db');

class Game {
  constructor(userId, board, solution, latitude, longitude) {
    this.userId = userId;
    this.board = board;
    this.solution = solution;
    this.latitude = latitude;
    this.longitude = longitude;
  }

  save(callback) {
    db.run('INSERT INTO games (user_id, board, solution, latitude, longitude) VALUES (?, ?, ?, ?, ?)',
      [this.userId, this.board, this.solution, this.latitude, this.longitude], function(err) {
        callback(err, this.lastID);
      });
  }

  static updateScore(gameId, score, callback) {
    db.run('UPDATE games SET score = ?, completed_at = CURRENT_TIMESTAMP WHERE id = ?',
      [score, gameId], callback);
  }

  static findByUserId(userId, callback) {
    db.all('SELECT * FROM games WHERE user_id = ? ORDER BY started_at DESC', [userId], callback);
  }

  static findById(id, callback) {
    db.get('SELECT * FROM games WHERE id = ?', [id], callback);
  }
}

module.exports = Game;
