/*
## fetch questions from fake API and manage with useReducer

**User story:**
As a user, I want the quiz to load questions from an API when
the app starts, so I can take a real quiz instead of seeing
hardcoded data.

**Acceptance criteria:**
- [ ] json-server runs on port 8000 serving data/questions.json
- [ ] App fetches questions on mount using useEffect
- [ ] Questions stored in reducer state (not useState)
- [ ] Status transitions: "loading" → "ready" on success
- [ ] Status transitions: "loading" → "error" on failure
- [ ] Both questions and status update in ONE dispatch (not two)

**Flowchart:**
```
App mounts
    │
    ▼
useEffect([]) runs
    │
    ▼
fetch("http://localhost:8000/questions")
    │
    ├── SUCCESS
    │       │
    │       ▼
    │   dispatch({ type: "dataReceived", payload: data })
    │       │
    │       ▼
    │   reducer: case "dataReceived"
    │       → { ...state, questions: data, status: "ready" }
    │       (TWO state values updated, ONE dispatch) ✅
    │
    └── FAILURE
            │
            ▼
        dispatch({ type: "dataFailed" })
            │
            ▼
        reducer: case "dataFailed"
            → { ...state, status: "error" }
```
*/
import { useEffect, useReducer } from "react";
import Main from "./components/Main";
import Header from "./Header";

/**
 * All possible application statuses
 * Mutually exclusive - only one can be true at a time
 * "loading" | "error" | "ready" | "active" | "finished"
 */
const intialState = {
  questions: [], // array of questions object from API
  status: "", // current app statuses - drives what UI is shown
};

/**
 * Main reducer for the React Quiz App.
 * Centralizes all state transitions.
 *
 * @param { {questions: Array, status: string} } state
 * @param { {type: string, payload?: any } } action
 * @returns { {questions: Array, status: string} } Next state
 */
function reducer(state, action) {
  console.log(state, action);
  switch (action.type) {
    case "dataReceived":
      /**
       * Questions loaded successfully.
       * Updates both questions and status in one one atomic transition.
       * payload: array of questions object from API
       */
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      /**
       * Fetch failed - no payload needed
       * status alone communicates the failures to the UI
       */
      return { ...state, status: "error" };
    default:
      throw new Error("Invalid action");
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, intialState);
  //   useEffect(function () {
  //     async function fetchQuestion() {
  //       try {
  //         const res = await fetch(`http://localhost:8000/questions`);
  //         if (!res.ok) throw new Error("Something went wrong.");
  //         const data = await res.json();
  //         //   console.log(data);
  //         dispatch({ type: "dataReceived", payload: data });
  //       } catch (e) {
  //         console.log(e);
  //         dispatch({ type: "dataFailed" });
  //       }
  //     }
  //     fetchQuestion();
  //   }, []);

  /**
   * Fetch questions on mount.
   * Uses .then() chain - no async/await needed for simple fetch.
   * On success: dispatch 'dataReceived with questions array as payload
   * On error: dispatch 'dataFailed' (no payload - status string is enough)
   */
  useEffect(function () {
    fetch(`http://localhost:8000/questions`)
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);
  return (
    <div className="app">
      <Header />
      <Main className="main">
        <p>1/15</p>
        <p>Question</p>
      </Main>
    </div>
  );
}

export default App;
