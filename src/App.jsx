import { useState } from "react";

function App() {
  return <Counter />;
}

function Counter() {
  const [step, setStep] = useState(1);
  const [count, setCount] = useState(0);

  const date = new Date();
  date.setDate(date.getDate() + count);

  function handleDecrementStep() {
    if (step > 1) {
      setStep((prevStep) => prevStep - 1);
    }
  }

  function handleIncrementStep() {
    setStep((prevStep) => prevStep + 1);
  }

  function handleDecrementCount() {
    setCount((prevCount) => prevCount - step);
  }

  function handleIncrementCount() {
    setCount((prevCount) => prevCount + step);
  }

  function handleReset() {
    setStep(1);
    setCount(0);
  }

  return (
    <div>
      <div>
        <input
          type="range"
          min="0"
          max="10"
          value={step}
          onChange={(e) => setStep(Number(e.target.value))}
        />
        <span>{step}</span>
      </div>
      <div>
        <button onClick={handleDecrementCount}>-</button>
        <input
          type="text"
          value={count}
          onChange={(e) => setCount(e.target.value)}
        />
        <button onClick={handleIncrementCount}>+</button>
      </div>
      <span>
        {count === 0
          ? "Today is "
          : count > 0
            ? `${count} days from today is `
            : `${count} days ago was `}
      </span>
      {date.toDateString()}
      {step !== 1 || count !== 0 ? (
        <div>
          <button onClick={handleReset}>Reset</button>
        </div>
      ) : null}
    </div>
  );
}

export default App;
