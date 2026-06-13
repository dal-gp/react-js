/*
## Countdown timer - auto-finish while taking the quiz, and the quiz 
automatically end when time runs out.

**User Story:**
As a user, I want to see a countdown timer while taking the quiz, and have 
the quiz automatically end when time runs out.

**Acceptance criteria:**
- [ ] Timer starts when quiz becomes active (not on page load)
- [ ] Quiz automatically transitions to "finished" when timer hits 0.
- [ ] Timer counts down once per second
- [ ] Timer displays as MM:SS with leading zeros(e.g. 07:05)
- [ ] Timer stops when component unmounts (no accumulating intervals)
- [ ] Seconds are calculated from number of questions * SECS_PER_QUESTION
- [ ] secondsRemaining starts as null, set to calculated value on 'start'

**Algorithm:**
1. Add secondsRemaining: null to initialState
2. In "start" case: set secondsRemaining = questions.length * SECS_PER_QUESTION
3. Add "tick" case: decrement secondsRemaining by 1; if it reaches 0, set status to "finished"
4. Create Timer component — receives dispatch and secondsRemaining as props
5. In Timer useEffect([], [dispatch]): start setInterval that dispatches "tick" every 1000ms
6. Store interval ID, return clearInterval(id) as cleanup
7. Format display: mins = Math.floor(secs / 60), seconds = secs % 60
8. Add leading zero: {mins < 10 && "0"}{mins}:{secs < 10 && "0"}{secs}
9. Wrap Timer and NextButton in a Footer component (component composition)

**Why secondsRemaining starts as null (not a number):**
- Questions aren't loaded yet at initialState — we don't know how many there are
- Calculated in the "start" case when questions.length is available
- If started as a hardcoded number it would be wrong before questions load

**Why the auto-finish check lives in the "tick" case (not in the component):**
- The reducer owns all state transition logic
- Checking in the component and dispatching a separate "finish" action would
  cause an extra render and a timing gap
- In the reducer: one tick → decrement + check → update both in one return

**Why Timer component (not App) starts the interval:**
- Timer mounts exactly when status becomes "active"
- App mounts on page load — interval would start immediately, not on quiz start
- Timer unmounts on finish/restart → cleanup fires automatically → no leaked timers

**The accumulating timer bug and its fix:**
```
WITHOUT cleanup:
  Quiz start 1: interval #1 starts → ticks 1x/sec
  Quiz restart: interval #1 still running + interval #2 starts → ticks 2x/sec
  Quiz restart again: 3 intervals → 3x speed
  → timer races to zero almost instantly

WITH cleanup (clearInterval on unmount):
  Quiz start: interval #1 starts
  Quiz restart: Timer unmounts → clearInterval(#1) runs → interval stopped
  Timer remounts: interval #2 starts fresh → 1x/sec ✅
```

**Flowchart:**
```
status becomes "active" → Timer component mounts
    │
    ▼
useEffect runs → setInterval(dispatch("tick"), 1000)
    │
    ▼ (every second)
dispatch({ type: "tick" })
    │
    ▼
reducer: case "tick"
    ├── secondsRemaining: state.secondsRemaining - 1
    └── status: secondsRemaining === 0 ? "finished" : state.status
    │
    ├── secondsRemaining > 0 → timer display updates ✅
    └── secondsRemaining === 0 → status = "finished"
                                  → FinishScreen renders
                                  → Timer unmounts
                                  → clearInterval fires → timer stops ✅
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
import Timer from "./Timer";
import Footer from "./Footer";

/** Seconds allocated per question.
 * Change here to adjust quiz duration.
 */
const SECS_PER_QUESTION = 30;

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
  secondsRemaining: 10, // null until 'start' - questions.length not known yet
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
      return {
        ...state,
        status: "active",
        // Calculate total time from question count - only possible once
        // questions are loaded
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
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
        status: "finished",
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
    case "tick": {
      /**
       * Decrements timer by 1
       * Also checks if time has run out - transitions to 'finished' atomically.
       * Two state values updated in one dispatch ( no extra render or timing gap )
       */
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    }
    default:
      throw new Error("Invalid action");
  }
}

function App() {
  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);
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
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={numQuestions}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
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
