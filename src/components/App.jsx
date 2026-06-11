/*
## Dispaly quiz progress bar and score

**User Story:**
As a user, I want to see current question number, score and visual progress bar
so I know how far thorugh the quiz I am and how many points I have earned.

**Acceptance criteria:**
- [ ] Shows "Question X / 15" (1-based, not 0-based)
- [ ] Shows current points out of max possible points
- [ ] Progress bar fills as questions are answered
- [ ] Progress bar advances immediately when an answer is selected
       (not just when Next is clicked)
- [ ] maxPossiblePoints derived from questions array (not stored in state)

**Algorithm:**
1. Create Progress component — accepts index, numQuestions, points, maxPossiblePoints, answer
2. Display index + 1 (convert 0-based to 1-based for users)
3. Compute maxPossiblePoints in App with questions.reduce()
4. Use HTML <progress> element with max={numQuestions} and value={index + Number(answer !== null)}
5. The Number(answer !== null) trick: false → 0 (unanswered), true → 1 (answered) → bar advances immediately on answer, before Next is clicked

**Why maxPossiblePoints is derived state (not stored in reducer):**
- It can be computed from questions array which is already in state
- Storing a value that can be derived = unnecessary state = potential bugs
- Calculated once and passed as a prop

**Why the progress bar uses index + Number(answer !== null):**
- Without this: bar only advances when Next is clicked (index increments)
- With this: bar advances immediately when answer given (feels more responsive)
- Number(false) = 0, Number(true) = 1 — a clean way to convert a boolean to 0 or 1

**Flowchart:**
```
Quiz active, index=0, answer=null
    │
    ▼
<progress value={0 + Number(false)} max={15} />
  = value=0 → bar empty

User clicks answer (e.g. index 2)
    │
    ▼
answer = 2 (not null)
    │
    ▼
<progress value={0 + Number(true)} max={15} />
  = value=1 → bar advances immediately ✅

User clicks Next → index becomes 1, answer resets to null
    │
    ▼
<progress value={1 + Number(false)} max={15} />
  = value=1 → same position, ready for next answer
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
  const [{ questions, status, index, answer, points }, dispatch] = useReducer(
    reducer,
    intialState,
  );
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
            <NextButton dispatch={dispatch} answer={answer} />
          </>
        )}
      </Main>
    </div>
  );
}

export default App;
