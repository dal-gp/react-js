/**
 * Rnders either a "Next" or "Finish" button depending on quiz position.
 * Returns null if no answer has been given yet.
 *
 * @param {Function} dispatch - useReducer dispatch
 * @param {number | null} answer - null if unanswered, number if answered
 * @param {number} index - Current question index (0-based)
 * @param {numQuestions} - Total number of questions
 */
function NextButton({ dispatch, answer, index, numQuestions }) {
  // Don't show button until user has answered
  if (answer === null) return;

  // Show "Next" for all questions excpet the last
  if (index < numQuestions - 1)
    return (
      <div>
        <button
          className="btn btn-ui"
          onClick={() => dispatch({ type: "nextQuestion" })}
        >
          Next
        </button>
      </div>
    );

  // Show "Finish" on the last question
  if (index === numQuestions - 1)
    return (
      <div>
        <button
          className="btn btn-ui"
          onClick={() => dispatch({ type: "finish" })}
        >
          Finish
        </button>
      </div>
    );
}

export default NextButton;
