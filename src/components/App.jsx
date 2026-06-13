/*
## Finish the quiz - finish screen, highscore, and smart Next button 

**User Story:**
As a user, after answering the last question I want to see my final score, 
percentage, an emoji rating, and my high score, instead of a broken 'Next' button
that goes out of bounds.


**Acceptance criteria:**
- [ ] FinishScreen shows score, max points, percentage, emoji
- [ ] On the last question, "Next" button shows "Finish" instead
- [ ] Clicking "Finish" transititons status to "finished"
- [ ] Emoji changes based on percentage range 
- [ ] High score tracked - updates only if current score beats it

**Algorithm:**
1. Add highscore: 0 to initialState
2. Add 'finish' case to reducer - sets status 'finished' AND updates highscore
3. Update NextButton - Check index vs numQuestions - 1 to show "Next" or "Finish"
4. Create FinishScreen - receives points, maxPossiblePoints, highscore
5. Inside FinishScreen: compute percentage, assign emoji via if statements
6. Add status === 'finished' condition in App JSX

**Why highscore is updated in the reducer (not in FinishScreen):**
- Highscore is state — it must live in the reducer
- The "finish" action is the exact moment points are finalised
- Updating both status and highscore in one dispatch = atomic transition

**Why use a let variable for emoji (not ternary):**
- 5 mutually exclusive conditions — nested ternaries would be unreadable
- Sequential if statements on a let variable is cleaner for many conditions

**Flowchart:**
```
User on last question (index = 14), answer given
    │
    ▼
NextButton: index === numQuestions - 1 → show "Finish" button
    │
    ▼
User clicks "Finish"
    │
    ▼
dispatch({ type: "finish" })
    │
    ▼
reducer: case "finish"
    → status: "finished"
    → highscore: state.points > state.highscore
                 ? state.points        (new record)
                 : state.highscore     (keep old record)
    │
    ▼
Re-render:
  status === "active"   → hidden
  status === "finished" → FinishScreen shown ✅

FinishScreen:
  percentage = (points / maxPossiblePoints) * 100
  100%         → 🏅
  80–99%       → 🎉
  50–79%       → 🙂
  1–49%        → 🤔
  0%           → 🤦‍♂️
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
const intialState = {
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
    default:
      throw new Error("Invalid action");
  }
}

function App() {
  const [{ questions, status, index, answer, points, highscore }, dispatch] =
    useReducer(reducer, intialState);
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
          />
        )}
      </Main>
    </div>
  );
}

export default App;
