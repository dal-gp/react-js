/**
 * Dispalyed when the quiz is complete.
 * Shows final score, percentage with emoji, and session high score.
 *
 * @param {number} points - Final score achieved
 * @param {number} maxPossiblePoints - Maximum achievable score
 * @param {highscore} highscore - Best score achieved this session
 * @param {Function} dispatch - useReducer dispatch to trigger "restart"
 * @returns
 */
function FinishScreen({ points, maxPossiblePoints, highscore, dispatch }) {
  const percentage = (points / maxPossiblePoints) * 100;

  /**
   * Emoji selected based on percentage range.
   * Using a let + sequential ifs instead of nested ternaries
   * because 5 conditions would be unreadable as a ternary chain.
   * @type {string}
   */
  let emoji;
  if (percentage === 100) emoji = "🏅";
  if (percentage >= 80 && percentage < 100) emoji = "🎉";
  if (percentage >= 50 && percentage < 80) emoji = "🙂";
  if (percentage > 0 && percentage < 50) emoji = "🤔";
  if (percentage === 0) emoji = "🤦‍♂️";
  return (
    <div>
      <p className="result">
        <span>{emoji}</span>You scored <strong>{points}</strong> out of{" "}
        {maxPossiblePoints} ({Math.ceil(percentage)}%)
      </p>
      <p className="highscore">(Highscore: {highscore} points)</p>
      {/**
       * Restart dispatches "restart" - no payload needed, reducer handles every
       * thing
       */}
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "restart" })}
      >
        Restart Quiz
      </button>
    </div>
  );
}

export default FinishScreen;
