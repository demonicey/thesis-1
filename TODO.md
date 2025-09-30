# TODO for Sudoku Game Development

## Phase 1: Project Setup
- [x] Create package.json for Node.js dependencies
- [x] Set up basic Express server in server.js
- [x] Initialize database (SQLite) and create schema for users and games

## Phase 2: Backend Development
- [x] Create User model (models/User.js)
- [x] Create Game model (models/Game.js)
- [x] Implement authentication routes (routes/auth.js)
- [x] Implement game routes (routes/game.js) for starting games, submitting moves, etc.
- [x] Add location handling in routes (get user location, store in DB)

## Phase 3: Frontend Development
- [x] Create HTML structure (public/index.html)
- [x] Implement CSS styling (public/style.css)
- [x] Develop JavaScript game logic with OOD (public/script.js): classes for Board, Cell, Game
- [x] Integrate geolocation API for location-based features

## Phase 4: Security and Hack Analysis
- [ ] Implement basic anti-cheat measures (server-side validation, rate limiting)
- [ ] Document potential hacks: location spoofing, client-side manipulation, data injection
- [ ] Add prevention: input sanitization, session management, anomaly detection

## Phase 5: Testing and Refinement
- [ ] Test game functionality locally
- [ ] Test location features and database storage
- [ ] Analyze and simulate hacks, refine defenses
- [ ] Update README with security findings

## Phase 6: Finalization
- [ ] Ensure OOD principles are followed
- [ ] Document the project for thesis purposes
