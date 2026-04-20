import { useState } from "react";
import InputBill from "./components/InputBill";
import SelectPercentage from "./components/SelectPercentage";
import LabelOutput from "./components/LabelOutput";

function App() {
  const [bill, setBill] = useState("");
  const [percentage1, setPercentage1] = useState("");
  const [percentage2, setPercentage2] = useState("");
  return (
    <div>
      <InputBill bill={bill} setBill={setBill}>
        How much was the bill?
      </InputBill>
      <SelectPercentage
        percentage={percentage1}
        onSetPercentage={setPercentage1}
      >
        How did you like the service?
      </SelectPercentage>
      <SelectPercentage
        percentage={percentage2}
        onSetPercentage={setPercentage2}
      >
        How did your friend like the service?
      </SelectPercentage>
      <LabelOutput
        bill={bill}
        serviceRating1={percentage1}
        serviceRating2={percentage2}
      >
        af
      </LabelOutput>
    </div>
  );
}

export default App;
