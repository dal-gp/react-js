/*
## Move to next question and reset answer state

**User story:**
As a user, after answering a question I want a "Next" button
to appear so I can advance to the next question with a clean slate.

**Acceptance criteria:**
- [ ] "Next" button only appears after an answer has been given
- [ ] Clicking "Next" advances to the next question
- [ ] Previous answer is cleared (buttons re-enabled, no colours shown)
- [ ] Both index and answer update in ONE dispatch

**Algorithm:**
1. Add "nextQuestion" case to reducer: index + 1, answer reset to null
2. Create NextButton component that receives dispatch and answer
3. If answer === null → return null (render nothing)
4. Otherwise render the button with onClick dispatching "nextQuestion"
5. Pass dispatch and answer into NextButton from parent

**Flowchart:**
```
User answers a question
    │
    ▼
answer state = 2 (not null)
    │
    ▼
NextButton renders the "Next" button (answer !== null)

User clicks "Next"
    │
    ▼
dispatch({ type: "nextQuestion" })
    │
    ▼
reducer: case "nextQuestion"
    → { ...state, index: state.index + 1, answer: null }
    (TWO values reset in ONE dispatch) ✅
    │
    ▼
Re-render: new question shown, answer = null → NextButton disappears
Options re-enabled, no colour classes applied
```

*/
import { useEffect, useReducer } from "react";
import Main from "./Main";
import Header from "./Header";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";

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
    case "nextQuestion": {
      /**
       * Advances to the next question and clears the previous answer.
       * Both must update together - answer null re-enables options for new
       * questions
       */
      return {
        ...state,
        index: state.index + 1,
        answer: null, //reset so Options re-enable and colours clear
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
          <>
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <NextButton dispatch={dispatch} answer={answer} />
          </>
        )}
      </Main>
    </div>
  );
}

export default App;
