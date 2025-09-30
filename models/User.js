const db = require('../database/db');

class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  static create(username, password, callback) {
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], function(err) {
      callback(err, this.lastID);
    });
  }

  static findByUsername(username, callback) {
    db.get('SELECT * FROM users WHERE username = ?', [username], callback);
  }

  static findById(id, callback) {
    db.get('SELECT * FROM users WHERE id = ?', [id], callback);
  }
}

module.exports = User;
