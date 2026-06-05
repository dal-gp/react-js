import { useReducer, useState } from "react";

/**
 * Reducer for the count state in DateCounter.
 * Pure function - no side effects. All update logic lives here.
 *
 * @param {number} state - Current count value
 * @param {{type: string, payload?: number}} action - Dispatched action
 * @returns {number} Next count value
 */
function reducer(state, action) {
  if (action.type === "inc") return state + 1;
  if (action.type === "dec") return state - 1;
  if (action.type === "setCount") return action.payload;
}

function DateCounter() {
  /**
   * count: current day offset from base date
   * dispatch: sends actions to the reducer (replaces setCount)
   * @type {[number, Function]}
   */
  const [count, dispatch] = useReducer(reducer, 0);
  const [step, setStep] = useState(1);

  // This mutates the date object.
  const date = new Date("june 21 2027");
  date.setDate(date.getDate() + count);

  /**
   * Decreases count by 1.
   * Reducer knows dec = -1, so no payload needed.
   */
  const dec = function () {
    dispatch({ type: "dec" });
  };

  /**
   * Increseas count by 1.
   * Reducer knows inc = +1, so no payload needed.
   */
  const inc = function () {
    dispatch({ type: "inc" });
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

  const defineStep = function (e) {
    setStep(Number(e.target.value));
  };

  const reset = function () {
    // setCount(0);
    setStep(1);
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
