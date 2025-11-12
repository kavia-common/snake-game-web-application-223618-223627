/**
 * ScoreBar - Displays current score and best score.
 */

// PUBLIC_INTERFACE
export default function ScoreBar({ score, best }) {
  return (
    <div className="top-bar" aria-label="Score bar">
      <div className="score-badge" aria-live="polite">
        <span role="img" aria-hidden>🐍</span>
        <span>Score: {score}</span>
      </div>
      <div className="best-badge">
        <span role="img" aria-hidden>🏆</span>
        <span>Best: {best}</span>
      </div>
    </div>
  );
}
