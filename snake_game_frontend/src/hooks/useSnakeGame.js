/**
 * useSnakeGame - Encapsulates Snake game state and loop.
 * - Manages snake positions, direction, food, score, tick timing
 * - Supports wrap vs wall collision (feature flag)
 * - Keyboard controls: Arrow keys and WASD
 *
 * This hook is pure frontend; no backend deps.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getLocalJSON, setLocalJSON } from '../utils/storage';
import { getFeatureFlags } from '../utils/features';

const STORAGE_BEST_SCORE = 'snake_best_score_v1';

// Directions are 2D vector deltas
const DIR = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  KeyW: { x: 0, y: -1 },
  KeyS: { x: 0, y: 1 },
  KeyA: { x: -1, y: 0 },
  KeyD: { x: 1, y: 0 },
};

// PUBLIC_INTERFACE
export function useSnakeGame(options = {}) {
  /**
   * PUBLIC INTERFACE: Main game hook.
   * @param {object} options
   * @param {number} options.size - Board size (cells per side). Default 20.
   * @param {number} options.speed - Base ticks per second. Default 8.
   * @returns state and controls for the game loop and rendering.
   */
  const size = Math.max(8, Math.min(50, options.size || 20));
  const baseSpeed = Math.max(2, Math.min(20, options.speed || 8));
  const features = useMemo(() => getFeatureFlags(), []);

  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => getLocalJSON(STORAGE_BEST_SCORE, 0));
  const [wrap, setWrap] = useState(Boolean(features.wrap));

  // Snake is array of segments, head is first element
  const [snake, setSnake] = useState(() => {
    const mid = Math.floor(size / 2);
    return [{ x: mid, y: mid }];
  });
  const [food, setFood] = useState(() => spawnFood(size, [{ x: Math.floor(size / 2), y: Math.floor(size / 2) }]));

  // Direction state refs to avoid stale closures in RAF loop
  const dirRef = useRef({ x: 1, y: 0 }); // start moving right
  const nextDirRef = useRef({ x: 1, y: 0 });
  const lastTickRef = useRef(0);
  const speedRef = useRef(baseSpeed);
  const rafRef = useRef(0);

  // PUBLIC_INTERFACE
  const toggleWrap = useCallback(() => {
    setWrap(w => !w);
  }, []);

  const resetGame = useCallback(() => {
    const mid = Math.floor(size / 2);
    setSnake([{ x: mid, y: mid }]);
    setFood(spawnFood(size, [{ x: mid, y: mid }]));
    setScore(0);
    setGameOver(false);
    setPaused(false);
    dirRef.current = { x: 1, y: 0 };
    nextDirRef.current = { x: 1, y: 0 };
    speedRef.current = baseSpeed;
  }, [size, baseSpeed]);

  // PUBLIC_INTERFACE
  const start = useCallback(() => {
    if (running) return;
    resetGame();
    setRunning(true);
  }, [resetGame, running]);

  // PUBLIC_INTERFACE
  const pause = useCallback(() => {
    setPaused(true);
  }, []);

  // PUBLIC_INTERFACE
  const resume = useCallback(() => {
    if (!gameOver) setPaused(false);
  }, [gameOver]);

  // PUBLIC_INTERFACE
  const restart = useCallback(() => {
    resetGame();
    setRunning(true);
  }, [resetGame]);

  // Handle keyboard controls
  useEffect(() => {
    function onKeyDown(e) {
      const code = e.code;
      const dir = DIR[code];
      if (!dir) return;

      // prevent reverse direction instantly
      const current = dirRef.current;
      if (dir.x === -current.x && dir.y === -current.y) return;

      nextDirRef.current = dir;
    }

    function onSpace(e) {
      if (e.code === 'Space') {
        e.preventDefault();
        if (!running) {
          start();
        } else if (!gameOver) {
          setPaused(p => !p);
        }
      }
    }

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keydown', onSpace);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keydown', onSpace);
    };
  }, [running, gameOver, start]);

  // Game loop via requestAnimationFrame with fixed-timestep ticking
  useEffect(() => {
    if (!running || paused || gameOver) {
      cancelAnimationFrame(rafRef.current);
      return;
    }

    const tickIntervalMs = 1000 / speedRef.current;

    const loop = (t) => {
      if (!lastTickRef.current) lastTickRef.current = t;
      const elapsed = t - lastTickRef.current;
      if (elapsed >= tickIntervalMs) {
        lastTickRef.current = t;
        step();
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
    // Intentionally omit dependencies to control lifecycle by state flags
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, paused, gameOver, wrap]);

  const step = useCallback(() => {
    // update direction first
    dirRef.current = nextDirRef.current;
    const dir = dirRef.current;

    setSnake(prev => {
      const head = prev[0];
      let newHead = { x: head.x + dir.x, y: head.y + dir.y };

      if (wrap) {
        // wrap around edges
        newHead.x = (newHead.x + size) % size;
        newHead.y = (newHead.y + size) % size;
      } else {
        // wall collision
        if (newHead.x < 0 || newHead.y < 0 || newHead.x >= size || newHead.y >= size) {
          setGameOver(true);
          setRunning(false);
          return prev;
        }
      }

      // self collision (check against body)
      for (let i = 0; i < prev.length; i++) {
        if (prev[i].x === newHead.x && prev[i].y === newHead.y) {
          setGameOver(true);
          setRunning(false);
          return prev;
        }
      }

      // check food
      if (newHead.x === food.x && newHead.y === food.y) {
        const grown = [newHead, ...prev]; // grow by adding head without removing tail
        // increase score and speed slightly
        setScore(s => s + 1);
        speedRef.current = Math.min(20, speedRef.current + 0.25);
        const nextFood = spawnFood(size, grown);
        setFood(nextFood);
        return grown;
      } else {
        // move forward: add head and pop tail
        const moved = [newHead, ...prev.slice(0, -1)];
        return moved;
      }
    });
  }, [food, size, wrap]);

  // persist best score
  useEffect(() => {
    if (score > best) {
      setBest(score);
      setLocalJSON(STORAGE_BEST_SCORE, score);
    }
  }, [score, best]);

  return {
    // state
    size,
    running,
    paused,
    gameOver,
    score,
    best,
    wrap,
    snake,
    food,
    // controls
    start,
    pause,
    resume,
    restart,
    toggleWrap,
  };
}

/**
 * PUBLIC_INTERFACE
 * Compute a new food location that is not on the snake.
 */
export function spawnFood(size, snake) {
  // build a set of occupied cells
  const occupied = new Set(snake.map(s => `${s.x},${s.y}`));
  // naive approach: try random cells up to N times, fallback to scan
  for (let i = 0; i < 250; i++) {
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);
    const key = `${x},${y}`;
    if (!occupied.has(key)) return { x, y };
  }
  // fallback linear scan (worst case near-full board)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) return { x, y };
    }
  }
  // theoretically shouldn't happen
  return { x: 0, y: 0 };
}
