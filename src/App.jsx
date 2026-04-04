import { useState } from "react";

function App() {
  return <Counter />;
}

function Counter() {
  const [step, setStep] = useState(1);
  const [count, setCount] = useState(0);
  const [today, setToday] = useState(new Date());

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
    setToday(new Date(today.setDate(today.getDate() - step)));
  }

  function handleIncrementCount() {
    setCount((prevCount) => prevCount + step);
    // setToday((today) => today.setDate(today.getDate() + step));
    // new Date(today.setDate(today.getDate() + step)).toDateString();
    setToday(new Date(today.setDate(today.getDate() + step)));
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

      {/* {count === 0 && <span>Today is </span>}
      {count >= 1 && <span>`${count} days from today is `</span>}
      {count < 1 && <span>`${Math.abs(count)} days ago was `</span>} */}
      <span>
        {count === 0
          ? "Today is "
          : count > 0
            ? `${count} days from today is `
            : `${count} days ago was `}
      </span>

      {today.toDateString()}
    </div>
  );
}

export default App;
