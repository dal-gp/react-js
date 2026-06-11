/**
 * Displays quiz progress: current question, score and a progress bar.
 * Progress bar advances immediately on answer (before Next is clicked)
 * @param {number} index - Current question index (0-based)
 * @param {number} numQuestions - Total number of questions
 * @param {number} maxPossiblePoints - Maximum acheivable score
 * @param {number|null} answer - Current answer (null if unanswered)
 * @param {number} points - Current accumulated score
 */
function Progress({ index, numQuestions, maxPossiblePoints, answer, points }) {
  return (
    <header className="progress">
      {/*
       * Progress bar — value uses index + Number(answer !== null).
       * Number(false) = 0, Number(true) = 1.
       * This makes the bar advance immediately when an answer is selected,
       * rather than waiting for the Next button to increment the index.
       */}
      <progress max={numQuestions} value={index + Number(answer !== null)} />
      {/* index + 1 converts 0-based index to human readable 1-based */}
      <p>
        Question <strong>{index + 1}</strong> / {numQuestions}
      </p>
      <p>
        <strong>{points}</strong> / {maxPossiblePoints} points
      </p>
    </header>
  );
}

export default Progress;
