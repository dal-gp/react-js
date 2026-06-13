/**
 * Displays a countdown timer and starts the interval on mount.
 * Dispatches 'tick' every second - reducer handles decrement and auto-finish.
 * Cleans up interval on unmount to prevent accumulating timers on restart.
 *
 * Must live here (not App) so the interval starts only when status is "active"
 *
 * @param {Function} dispatch - useReducer dipsatch function
 * @param {number} secondsRemaining - Seconds left ( from reducer state )
 */
import { useEffect } from "react";

function Timer({ dispatch, secondsRemaining }) {
  const mins = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  useEffect(
    function () {
      /**
       * Start a 1-second interval that dispatches 'tick'.
       * Store the ID so we can cancel it in cleanup.
       */
      const id = setInterval(function () {
        dispatch({ type: "tick" });
      }, 1000);

      /**
       * CLeanup: cancel the internval when Timer unmounts.
       * Without this, every quiz restart adds another interval -
       * after 3 restarts, time would tick 3x per second.
       */
      return function () {
        clearInterval(id);
      };
    },
    [dispatch], // dispatch is stable but ESLint requires it in deps
  );
  return (
    <div className="timer">
      {mins < 10 && "0"}
      {mins}:{seconds < 10 && "0"}
      {seconds}
    </div>
  );
}

export default Timer;
