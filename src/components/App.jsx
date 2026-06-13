/*
## Restart the quiz

**User Story:**
As a user, after finishing the quiz I want a "Restart Quiz" button so I can 
play again without refreshing the page.

**Acceptance criteria:**
- [ ] "Restart Quiz" button appears on the FinishScreen
- [ ] Clicking it resets all state except questions array (no re-fetch)
- [ ] status resets to "ready" (shows StartScreen again)
- [ ] index, answer, points, highscore all reset to initial values
- [ ] questions remain in state (data doesnot need to be feched again)

**Algorithm:**
1. Add "restart" case to reducer
2. Return { ...initialState, questions: state.questions, status: "ready" }
3. Pass dispatch to FinishScreen as a prop
4. Add "Restart Quiz" button in FinishScreen that dispatches "restart"

**Why spread initialState and override questions + status (not spread state):**
- Spreading initialState guarantees every field returns to its default
- No risk of accidentally keeping a stale value if new state fields are added later
- Only two overrides needed: questions (keep them) + status (ready, not loading)
- Alternative (spread state, override each field) works but is more error-prone

**Two valid approaches — both work:**
```jsx
// ✅ Preferred — explicit reset to initialState, keep only questions
case "restart":
  return { ...initialState, questions: state.questions, status: "ready" };

// ✅ Also valid — spread state and manually reset each field
case "restart":
  return { ...state, status: "ready", index: 0, answer: null, points: 0, highscore: 0 };
```

**Flowchart:**
```
User on FinishScreen, clicks "Restart Quiz"
    │
    ▼
dispatch({ type: "restart" })
    │
    ▼
reducer: case "restart"
    → { ...initialState,         ← reset everything to defaults
        questions: state.questions, ← keep loaded questions (no re-fetch)
        status: "ready" }           ← show StartScreen, not loading spinner
    │
    ▼
Re-render:
  status === "finished" → FinishScreen hidden
  status === "ready"    → StartScreen shown ✅
  questions unchanged   → quiz can begin immediately ✅
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
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";

/**
 * All possible application statuses
 * Mutually exclusive - only one can be true at a time
 * "loading" | "error" | "ready" | "active" | "finished"
 */
const initialState = {
  questions: [], // array of questions object from API
  status: "loading", // current app statuses - drives what UI is shown,
  index: 0,
  answer: null, // null = no answer yet; number = index of selected option
  points: 0, // cumalative score
  highscore: 0, // persists across restarts within the session
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
    case "finish": {
      /**
       * Ends the quiz - transistions to finished status.
       * Updates highscore if current points exceed previous best.
       * Both status and highscore update in one atomic transition.
       */
      return {
        ...state,
        status: "finish",
        highscore:
          state.points > state.highscore
            ? state.points // new record
            : state.highscore, // keep existing best
      };
    }
    case "restart": {
      /**
       * Resets the quiz to its initial state.
       * Keeps question in state - avoids unnecessary re-fetch.
       * Sets status to "ready" (not "loading") so StartScreen shows immediately.
       *
       * Spreading initialState ensures ALL fields are reset,
       * even if new state properties are added in the future.
       */
      return {
        ...initialState,
        questions: state.questions, // preserve already-loaded questions
        status: "ready", // go to start screen, not loading
      };
    }
    default:
      throw new Error("Invalid action");
  }
}

function App() {
  const [{ questions, status, index, answer, points, highscore }, dispatch] =
    useReducer(reducer, initialState);
  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0,
  );

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
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              answer={answer}
              maxPossiblePoints={maxPossiblePoints}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <NextButton
              dispatch={dispatch}
              answer={answer}
              index={index}
              numQuestions={numQuestions}
            />
          </>
        )}
        {status === "finish" && (
          <FinishScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
