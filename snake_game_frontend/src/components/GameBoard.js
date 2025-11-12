/**
 * GameBoard - Renders the Snake board using a canvas.
 * - Scales with container via CSS; drawing uses internal pixel grid
 * - Smooth visuals with requestAnimationFrame draw sync to state updates
 */
import { useEffect, useRef } from 'react';

const BG_COLOR = '#0b1226';
const GRID_COLOR = 'rgba(255,255,255,0.04)';
const SNAKE_HEAD = '#2563EB';
const SNAKE_BODY = '#60a5fa';
const FOOD_COLOR = '#F59E0B';

// PUBLIC_INTERFACE
export default function GameBoard({ size, snake, food, running, paused, gameOver }) {
  /**
   * @param {number} size - cells per side
   * @param {Array<{x:number,y:number}>} snake - snake segments
   * @param {{x:number,y:number}} food - food position
   * @param {boolean} running
   * @param {boolean} paused
   * @param {boolean} gameOver
   */
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const rect = canvas.getBoundingClientRect();
    // ensure square backing store
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    draw();

    function drawGrid(cellSize) {
      const w = rect.width;
      const h = rect.height;
      const stepX = w / size;
      const stepY = h / size;
      ctx.strokeStyle = GRID_COLOR;
      ctx.lineWidth = 1;

      // vertical lines
      for (let x = 0; x <= size; x++) {
        const px = Math.floor(x * stepX) + 0.5;
        ctx.beginPath();
        ctx.moveTo(px, 0);
        ctx.lineTo(px, h);
        ctx.stroke();
      }
      // horizontal lines
      for (let y = 0; y <= size; y++) {
        const py = Math.floor(y * stepY) + 0.5;
        ctx.beginPath();
        ctx.moveTo(0, py);
        ctx.lineTo(rect.width, py);
        ctx.stroke();
      }
    }

    function draw() {
      const w = rect.width;
      const h = rect.height;
      const stepX = w / size;
      const stepY = h / size;
      const r = Math.min(stepX, stepY);

      // clear & background
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, w, h);

      // grid
      drawGrid(r);

      // food
      if (food) {
        ctx.fillStyle = FOOD_COLOR;
        roundedRect(ctx, food.x * stepX + 2, food.y * stepY + 2, stepX - 4, stepY - 4, 6);
        ctx.fill();
      }

      // snake body
      ctx.fillStyle = SNAKE_BODY;
      for (let i = snake.length - 1; i >= 1; i--) {
        const seg = snake[i];
        roundedRect(ctx, seg.x * stepX + 2, seg.y * stepY + 2, stepX - 4, stepY - 4, 6);
        ctx.fill();
      }

      // head
      if (snake[0]) {
        const head = snake[0];
        ctx.fillStyle = SNAKE_HEAD;
        roundedRect(ctx, head.x * stepX + 1.5, head.y * stepY + 1.5, stepX - 3, stepY - 3, 8);
        ctx.fill();
      }
    }
  }, [size, snake, food]);

  return (
    <div className="board-container" role="region" aria-label="Snake game board">
      <canvas ref={canvasRef} className="game-canvas" />
      {(paused || gameOver || !running) && (
        <div className="overlay" aria-live="polite">
          <div className="overlay-card">
            <h3 className="overlay-title">
              {!running ? 'Press Start to play' : gameOver ? 'Game Over' : 'Paused'}
            </h3>
            <p className="overlay-subtext">
              {gameOver ? 'You crashed into a wall or yourself.' : 'Use Arrow keys or WASD to move. Space to pause.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function roundedRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}
