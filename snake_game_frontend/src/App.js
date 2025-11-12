/**
 * App - Snake Game main page
 * - Renders header, ScoreBar, GameBoard, and Controls
 * - Applies Ocean Professional theme from styles/theme.css
 */
import React from 'react';
import './App.css';
import './styles/theme.css';
import { useSnakeGame } from './hooks/useSnakeGame';
import GameBoard from './components/GameBoard';
import ScoreBar from './components/ScoreBar';
import Controls from './components/Controls';

// PUBLIC_INTERFACE
function App() {
  const {
    size,
    running,
    paused,
    gameOver,
    score,
    best,
    wrap,
    snake,
    food,
    start,
    pause,
    resume,
    restart,
    toggleWrap,
  } = useSnakeGame({ size: 20, speed: 8 });

  return (
    <div className="app-shell">
      <div className="card">
        <div className="header">
          <h1 className="header-title">Snake</h1>
          <p className="header-subtitle">Eat the food, grow the snake, avoid collisions. Arrows/WASD to move.</p>
        </div>
        <div className="content">
          <ScoreBar score={score} best={best} />
          <div className="board-wrapper">
            <GameBoard
              size={size}
              snake={snake}
              food={food}
              running={running}
              paused={paused}
              gameOver={gameOver}
            />
          </div>
          <div style={{ marginTop: 12 }}>
            <Controls
              running={running}
              paused={paused}
              gameOver={gameOver}
              onStart={start}
              onPause={pause}
              onResume={resume}
              onRestart={restart}
              wrap={wrap}
              onToggleWrap={toggleWrap}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
