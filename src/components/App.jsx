/*
## Handle answer selection — highlight correct/wrong and award points

**User story:**
As a user, when I click an answer I want to see which option
was correct, which was wrong, and have my score updated —
all from that single click.

**Acceptance criteria:**
- [ ] Clicking an option stores it as the answer in state
- [ ] Selected option gets "answer" CSS class (which shifts el to right)
- [ ] Correct option gets "correct" class (blue), others get "wrong" (red/yellow)
- [ ] All buttons disabled after an answer is given (no re-clicking)
- [ ] Points awarded only if the correct option was selected
- [ ] Points value comes from the question object (not hardcoded)
- [ ] All 3 state changes (answer, points, disabled) happen in ONE dispatch

**Algorithm:**
1. Add answer: null and points: 0 to initialState
2. Add "newAnswer" case to reducer
3. Inside "newAnswer": get current question from state.questions.at(state.index)
4. Return { ...state, answer: payload, points: isCorrect ? state.points + question.points : state.points }
5. In Options: map gives (option, index) — dispatch on button click with payload: index
6. Derive hasAnswered = answer !== null
7. Disable all buttons when hasAnswered
8. Apply conditional classes based on hasAnswered, index === answer, index === correctOption

**Why the points logic belongs in the reducer:**
- The reducer already has access to state.questions and state.index
- Computing points at the dispatch site would mean passing extra data in the action
- Rule: dispatch raw facts (which option was clicked), reducer computes consequences

**Flowchart:**
```
User clicks option at index 2
    │
    ▼
dispatch({ type: "newAnswer", payload: 2 })
    │
    ▼
reducer: case "newAnswer"
    │
    ├── const question = state.questions.at(state.index)
    │
    ├── answer = 2 (action.payload)
    │
    ├── 2 === question.correctOption?
    │       ├── Yes → points = state.points + question.points
    │       └── No  → points = state.points (unchanged)
    │
    └── return { ...state, answer: 2, points: newPoints }
    │
    ▼
Re-render:
  - hasAnswered = true → all buttons disabled
  - index 2 === answer → gets "answer" class
  - index === correctOption → gets "correct" / others get "wrong"
```

```
*/
import { useEffect, useReducer } from "react";
import Main from "./Main";
import Header from "./Header";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";

/**
 * All possible application statuses
 * Mutually exclusive - only one can be true at a time
 * "loading" | "error" | "ready" | "active" | "finished"
 */
const intialState = {
  questions: [], // array of questions object from API
  status: "loading", // current app statuses - drives what UI is shown,
  index: 0,
  answer: null, // null = no answer yet; number = index of selected option
  points: 0, // cumalative score
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
    case "start":
      return { ...state, status: "active" };
    case "newAnswer": {
      /**
       * Handles an answer selection.
       * Updates answer and points in one atomic transition.
       * Points logic lives here - not at the dispatch call site.
       *
       * @param {number} action.payload - Index of the selected option
       */
      const question = state.questions.at(state.index); // get current question from state
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points // correct answer -> award points
            : state.points, // wrong answer -> no change
      };
    }
    default:
      throw new Error("Invalid action");
  }
}

function App() {
  const [{ questions, status, index, answer }, dispatch] = useReducer(
    reducer,
    intialState,
  );
  const numQuestions = questions.length;

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

  // status drives what the UI shows:
  // "loading" → <Loader />
  // "error"   → <Error />
  // "ready"   → <StartScreen numQuestions={numQuestions} />
  // (more cases added as the app grows)
  return (
    <div className="app">
      <Header />
      <Main className="main">
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <Question
            question={questions[index]}
            dispatch={dispatch}
            answer={answer}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
