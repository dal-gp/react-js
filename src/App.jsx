const messages = ["Learn React", "Apply for jobs", "Invest your new income"];

function App() {
  const step = 1;
  return (
    <div className="steps">
      <div className="numbers">
        <div className={` ${step >= 1 ? "active" : ""}`}>1</div>
        <div className={`${step >= 2 ? "active" : ""}`}>2</div>
        <div className={`${step >= 3 ? "active" : ""}`}>3</div>
      </div>
      <p>
        Step {step}: {messages[step - 1]}
      </p>
      <button style={{ backgroundColor: "#7950f2", color: "#fff" }}>
        Previous
      </button>
      <button style={{ backgroundColor: "#7950f2", color: "#fff" }}>
        Next
      </button>
    </div>
  );
}

export default App;
