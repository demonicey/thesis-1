// Object-Oriented Design for Sudoku Game

class Cell {
  constructor(row, col, value = 0, isGiven = false) {
    this.row = row;
    this.col = col;
    this.value = value;
    this.isGiven = isGiven;
    this.element = null;
  }

  setValue(value) {
    this.value = value;
    if (this.element) {
      this.element.textContent = value || '';
    }
  }

  isValid(board) {
    if (this.value === 0) return true;
    // Check row
    for (let c = 0; c < 9; c++) {
      if (c !== this.col && board[this.row][c].value === this.value) return false;
    }
    // Check column
    for (let r = 0; r < 9; r++) {
      if (r !== this.row && board[r][this.col].value === this.value) return false;
    }
    // Check 3x3 box
    const boxRow = Math.floor(this.row / 3) * 3;
    const boxCol = Math.floor(this.col / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        if (r !== this.row && c !== this.col && board[r][c].value === this.value) return false;
      }
    }
    return true;
  }
}

class Board {
  constructor(boardData) {
    this.cells = [];
    for (let row = 0; row < 9; row++) {
      this.cells[row] = [];
      for (let col = 0; col < 9; col++) {
        const value = boardData[row][col];
        const isGiven = value !== 0;
        this.cells[row][col] = new Cell(row, col, value, isGiven);
      }
    }
  }

  render(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const cell = this.cells[row][col];
        const cellEl = document.createElement('div');
        cellEl.className = 'cell';
        cellEl.textContent = cell.value || '';
        if (cell.isGiven) {
          cellEl.style.backgroundColor = '#e9ecef';
        } else {
          cellEl.contentEditable = true;
          cellEl.addEventListener('input', (e) => {
            const value = e.target.textContent;
            const num = parseInt(value);
            if (isNaN(num) || num < 1 || num > 9) {
              e.target.textContent = '';
            } else {
              cell.setValue(num);
              // Client-side validation (basic)
              if (!cell.isValid(this.cells)) {
                cellEl.style.color = 'red';
              } else {
                cellEl.style.color = 'black';
              }
            }
          });
        }
        cell.element = cellEl;
        container.appendChild(cellEl);
      }
    }
  }

  isSolved() {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (this.cells[row][col].value === 0) return false;
      }
    }
    return true;
  }
}

class SudokuGame {
  constructor() {
    this.board = null;
    this.gameId = null;
    this.userId = null;
    this.latitude = null;
    this.longitude = null;
    this.init();
  }

  init() {
    this.bindEvents();
    this.getLocation();
  }

  bindEvents() {
    document.getElementById('loginBtn').addEventListener('click', () => this.login());
    document.getElementById('registerBtn').addEventListener('click', () => this.register());
    document.getElementById('startGameBtn').addEventListener('click', () => this.startGame());
    document.getElementById('completeBtn').addEventListener('click', () => this.completeGame());
  }

  async apiCall(endpoint, method = 'POST', body = null) {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    };
    if (body) options.body = JSON.stringify(body);
    const response = await fetch(endpoint, options);
    return response.json();
  }

  async register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (!username || !password) return alert('Please fill all fields');
    const result = await this.apiCall('/auth/register', 'POST', { username, password });
    if (result.error) {
      alert(result.error);
    } else {
      alert('Registered successfully. Please login.');
    }
  }

  async login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (!username || !password) return alert('Please fill all fields');
    const result = await this.apiCall('/auth/login', 'POST', { username, password });
    if (result.error) {
      alert(result.error);
    } else {
      this.userId = result.userId;
      document.getElementById('auth').style.display = 'none';
      document.getElementById('game').style.display = 'block';
      alert('Logged in successfully');
    }
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          console.log('Location obtained:', this.latitude, this.longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Location access denied. Some features may not work.');
        }
      );
    } else {
      alert('Geolocation not supported');
    }
  }

  async startGame() {
    if (!this.latitude || !this.longitude) {
      alert('Location not available. Please enable location services.');
      return;
    }
    const result = await this.apiCall('/game/start', 'POST', {
      latitude: this.latitude,
      longitude: this.longitude
    });
    if (result.error) {
      alert(result.error);
    } else {
      this.gameId = result.gameId;
      this.board = new Board(result.board);
      this.board.render('board');
      alert('Game started!');
    }
  }

  async completeGame() {
    if (!this.gameId) return alert('No game started');
    if (!this.board.isSolved()) return alert('Game not completed');
    // Calculate score (simple: time or moves, placeholder)
    const score = 100; // Placeholder
    const result = await this.apiCall('/game/complete', 'POST', { gameId: this.gameId, score });
    if (result.error) {
      alert(result.error);
    } else {
      alert('Game completed and saved!');
    }
  }
}

// Initialize the game
const game = new SudokuGame();
