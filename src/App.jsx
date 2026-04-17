import { useState } from "react";

const messages = ["Learn React", "Apply for jobs", "Invest your new income"];

function App() {
  const [step, setStep] = useState(1);
  const [isOpen, setIsOpen] = useState(true);

  function handlePrevious() {
    if (step > 1) {
      setStep((prevStep) => prevStep - 1);
    }
  }

  function handleNext() {
    if (step < 3) {
      setStep((prevState) => prevState + 1);
    }
  }
  return (
    <>
      <button onClick={() => setIsOpen((prevIsOpen) => !prevIsOpen)}>
        &times;
      </button>
      {isOpen && (
        <div className="steps">
          <div className="numbers">
            <div className={step >= 1 ? "active" : ""}>1</div>
            <div className={step >= 2 ? "active" : ""}>2</div>
            <div className={step >= 3 ? "active" : ""}>3</div>
          </div>
          <p>
            Step {step}: {messages[step - 1]}
          </p>
          <Button bgColor="#7950f2" textColor="#fff" onClick={handlePrevious}>
            <span>👈</span>Previous
          </Button>
          <Button textColor="#fff" bgColor="#7950f2" onClick={handleNext}>
            Next <span>👉</span>
          </Button>
        </div>
      )}
    </>
  );
}

function Button({ textColor, bgColor, onClick, children }) {
  return (
    <button
      style={{ color: textColor, backgroundColor: bgColor }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default App;
