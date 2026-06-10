/**
 * Renders Next button only after an answer has been given.
 * Returns null (renders nothing ) if no answer yet.
 * Self-manages its own visibility - parent doesnot need to conditionally
 * render it.
 * @param {Function} dispatch - useReducer dispatch
 * @param {number | null} answer - null if unanswered, number if answered
 * @returns {JSX.Element|null}
 */
function NextButton({ dispatch, answer }) {
  // No answer yet -> render nothing (button stays hidden)
  if (answer === null) return;
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
}

export default NextButton;
