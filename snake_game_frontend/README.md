# Snake Game Frontend (React)

A modern, responsive Snake game implemented in React with a clean UI.

## Run locally

- Install dependencies: `npm install`
- Start dev server: `npm start`
- Open http://localhost:3000

## Features

- Canvas-based board, smooth movement
- Score and best score (localStorage)
- Controls: Start, Pause/Resume, Restart
- Keyboard: Arrow keys and WASD; Space to pause/resume
- Optional wrap-around mode via feature flag
- Fully frontend; no backend required

## Environment variables

Create a `.env` (or set in your environment). Optional flags:

- `REACT_APP_FEATURE_FLAGS` — JSON string, ex:
  - `{"wrap": true}` to start with wrap-around mode enabled

Example `.env`:
```
REACT_APP_FEATURE_FLAGS={"wrap":false}
```

See `.env.example` for a template.

## Accessibility

- Focus-visible styles on buttons
- Aria labels on controls and board
- Live region messaging for game status

## Project structure

- `src/components/` — GameBoard (canvas), ScoreBar, Controls
- `src/hooks/` — `useSnakeGame` (game state & logic)
- `src/utils/` — storage, features, random
- `src/styles/` — theme.css

## Tests

Run `npm test`. Basic tests cover utilities and food spawning logic.

## Notes

- No secrets are stored in code. Feature flags are read from env only.
- No backend calls are performed.
