/*
Convert DateCounter from useSTate to useReducer (count only)

**User story**
As a developer, I want to manage the count state with useReducer instead of 
useState so I can centralise all state update logic in one place.


**Acceptance criteria**
- [ ] Increment button increases count by 1
- [ ] Decrement button decreases count by 1
- [ ] Typing a number into the input sets count to that  value
- [ ] All update logic lives in the reducer, not in event handlers
- [ ] Reducer is defined outside the component
*/
import DateCounter from "./DateCounter";

function App() {
  return (
    <div className="app">
      <DateCounter />
    </div>
  );
}

export default App;
