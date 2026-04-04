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

  return (
    <div>
      <div>
        <button onClick={handleDecrementStep}>-</button>
        <span>Step: {step}</span>
        <button onClick={handleIncrementStep}>+</button>
      </div>
      <div>
        <button onClick={handleDecrementCount}>-</button>
        <span>Count: {count}</span>
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
    </div>
  );
}

export default App;
