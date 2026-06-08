import { useReducer } from "react";

/**
 * Initial state for the DateCounter.
 * Defined outside component - used both as default an din the 'reset' case.
 * @type { {count: number, step: number}}
 */
const initialState = { count: 0, step: 1 };

/**
 * Reducer for DateCounter - manages count and step together.
 * All state transition logic lives here.
 * Event handlers only dispatch.
 *
 * @param {{count: number, step: number}} state - Current state object
 * @param {{type: string, payload?: number}} action - Dispatched action
 * @returns {{count: number, step: number}} Next state object
 */
function reducer(state, action) {
  switch (action.type) {
    case "dec":
      return { ...state, count: state.count - state.step };
    case "inc":
      return { ...state, count: state.count + state.step };
    case "setCount":
      return { ...state, count: action.payload };
    case "setStep":
      return { ...state, step: action.payload };
    case "reset":
      return initialState;
    default:
      throw new Error("Unknown action");
  }
}

function DateCounter() {
  /**
   * state: { count, step } - both managed together
   * dispatch: sends actions to render
   * @type { [ {count: number, step: number}, Function] }
   */
  const [state, dispatch] = useReducer(reducer, initialState);
  const { count, step } = state; // destructure for clean JSX access

  // This mutates the date object.
  const date = new Date("june 21 2027");
  date.setDate(date.getDate() + count);

  /**
   * Event handlers - describe WHAT happened, no logic
   */
  const dec = function () {
    dispatch({ type: "dec" });
  };
  const inc = function () {
    dispatch({ type: "inc" });
  };
  const reset = function () {
    dispatch({ type: "reset" });
  };

  /**
   * Sets count to the exact value typed into the input.
   * Payload is required here - reducer can't know the typed value.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  const defineCount = function (e) {
    dispatch({ type: "setCount", payload: Number(e.target.value) });
  };

  /**
   * Sets step to the slider value.
   * @param {React.ChangeEvent<HTMLInputELement>} e
   */
  const defineStep = function (e) {
    dispatch({ type: "setStep", payload: Number(e.target.value) });
  };

  return (
    <div className="counter">
      <div>
        <input
          type="range"
          min="0"
          max="10"
          value={step}
          onChange={defineStep}
        />
        <span>{step}</span>
      </div>

      <div>
        <button onClick={dec}>-</button>
        <input value={count} onChange={defineCount} />
        <button onClick={inc}>+</button>
      </div>

      <p>{date.toDateString()}</p>

      <div>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
export default DateCounter;
