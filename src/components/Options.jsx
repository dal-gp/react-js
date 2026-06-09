/**
 * Renders answer option buttons for the current question.
 * Handles answer selection via dispatch.
 * Disables all button once answer has been given.
 * Applies conditional CSS to show correct/wrong after answering.

 * @param {Object} question - Current question object (options, correctOption)
 * @param {Function} dispatch - useReducer dispatch function
 * @param {number | null} - Index of selected answer or null if none yet
 */
function Options({ question, dispatch, answer }) {
  /**
   * True once any option has been selected - used to disable buttons and
   * show colors
   */
  const hasAnswered = answer !== null;
  return (
    <div className="options">
      {question.options.map((option, idx) => (
        <button
          className={`btn btn-option ${idx === answer ? "answer" : ""} ${hasAnswered ? (idx === question.correctOption ? "correct" : "wrong") : ""}`}
          key={option}
          onClick={() => dispatch({ type: "newAnswer", payload: idx })}
          disabled={hasAnswered} // lock in once answered
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Options;
