/*
Combine count and step into single useReducer with object state

**User story**
As a developer, I want both count and step managed by one reducer so all state
transitions are centralised and a single 'reset' action can restore all state 
at once.

**Acceptance criteria**
- [ ] count and step live in one state object, not two separate useStates
- [ ] Incrementing/decrementing uses the current step value
- [ ] Typing in the count input sets count to that exact value
- [ ] Moving the slider sets step to that exact value
- [ ] Reset button restores both count=0 and step=1 in ONE dispatch
- [ ] All logic lives in the reducer - event handlers only dispatch


**Algorithm:**
1. Define initialState object outside the component: { count: 0, step: 1 }
2. Replace both useStates with one useReducer(reducer, initialState)
3. Destructure { count, step } from state for use in JSX
4. Convert reducer to use a switch statement on action.type
5. Each case returns { ...state, <changed property> } — spread then override
6. Add "reset" case that returns initialState directly
7. Update "inc"/"dec" cases to use state.step instead of hardcoded 1
8. Replace setStep() calls with dispatch({ type: "setStep", payload })

**Flowchart:**
```
initialState = { count: 0, step: 1 }
    │
    ▼
useReducer(reducer, initialState)
    │
    ├── state = { count: 0, step: 1 }
    └── dispatch = send actions to reducer

User moves slider (step=3)
    │
    ▼
dispatch({ type: "setStep", payload: 3 })
    │
    ▼
reducer: case "setStep" → { ...state, step: 3 }
    │
    ▼
state = { count: 0, step: 3 }

User clicks "+"
    │
    ▼
dispatch({ type: "inc" })
    │
    ▼
reducer: case "inc" → { ...state, count: 0 + 3 } = { count: 3, step: 3 }

User clicks "Reset"
    │
    ▼
dispatch({ type: "reset" })
    │
    ▼
reducer: case "reset" → initialState = { count: 0, step: 1 } ✅
```
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
