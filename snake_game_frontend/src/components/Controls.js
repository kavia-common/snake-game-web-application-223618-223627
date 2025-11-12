/**
 * Controls - Start/Pause/Resume/Restart and Wrap toggle
 * Accessible buttons with clear aria-labels and focus styles.
 */

// PUBLIC_INTERFACE
export default function Controls({ running, paused, gameOver, onStart, onPause, onResume, onRestart, wrap, onToggleWrap }) {
  return (
    <div className="controls" role="group" aria-label="Game controls">
      {!running && (
        <button className="btn" onClick={onStart} aria-label="Start game">
          Start
        </button>
      )}
      {running && !paused && !gameOver && (
        <button className="btn ghost" onClick={onPause} aria-label="Pause game">
          Pause
        </button>
      )}
      {running && paused && !gameOver && (
        <button className="btn" onClick={onResume} aria-label="Resume game">
          Resume
        </button>
      )}
      {(running || gameOver) && (
        <button className="btn secondary" onClick={onRestart} aria-label="Restart game">
          Restart
        </button>
      )}
      <button
        className={`btn ${wrap ? '' : 'ghost'}`}
        onClick={onToggleWrap}
        aria-pressed={wrap}
        aria-label="Toggle wrap-around walls"
        title="Wrap-around mode"
      >
        {wrap ? 'Wrap: On' : 'Wrap: Off'}
      </button>
    </div>
  );
}
