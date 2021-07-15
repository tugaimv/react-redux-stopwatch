import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  timerStarted,
  timerStopped,
  timerRemoved,
  timersStartedAfterLoad,
  timersAddedFromStorage,
} from "./timersSlice";

import { miliseconds, msToTime } from "../../helpers/helper";

export const TimerList = () => {
  const timers = useSelector((state) => state.timers);
  const dispatch = useDispatch();

  useEffect(() => {
    const beforeunload = () => {
      timers.forEach((timer) => {
        const modifiedTimer = {
          ...timer,
          timestampAdded: Date.now(),
        };
        modifiedTimer.miliseconds = miliseconds(
          timer.hours,
          timer.minutes,
          timer.seconds
        );
        localStorage.setItem(timer.id, JSON.stringify(modifiedTimer));
      });
    };
    window.addEventListener("beforeunload", beforeunload);

    return () => window.removeEventListener("beforeunload", beforeunload);
  }, [timers]);

  useEffect(() => {
    const load = () => {
      const loadedTimers = Object.keys(localStorage).map((key) => {
        let loadedTimer = JSON.parse(localStorage.getItem(key));
        const difference = Date.now() - loadedTimer.timestampAdded;

        const convertedMsToTime = msToTime(
          loadedTimer.miliseconds + difference
        );

        delete loadedTimer.timestampAdded;
        delete loadedTimer.miliseconds;
        loadedTimer = {
          ...loadedTimer,
          hours: loadedTimer.stop ? loadedTimer.hours : convertedMsToTime.hours,
          minutes: loadedTimer.stop
            ? loadedTimer.minutes
            : convertedMsToTime.minutes,
          seconds: loadedTimer.stop
            ? loadedTimer.seconds
            : convertedMsToTime.seconds,
        };

        return loadedTimer;
      });
      dispatch(timersAddedFromStorage(loadedTimers));
      dispatch(timersStartedAfterLoad());
      localStorage.clear();
    };
    window.addEventListener("load", load);

    return () => window.removeEventListener("load", load);
  }, [dispatch]);

  const startOrStopTimer = (timerId) => {
    const timer = timers.find((timer) => timer.id === timerId);
    if (timer.stop) {
      dispatch(timerStarted(timerId));
    } else {
      const { intervalId } = timer;
      clearInterval(intervalId);
      dispatch(timerStopped(timerId));
    }
  };

  const remove = (timerId) => {
    const { intervalId } = timers.find((timer) => timer.id === timerId);
    clearInterval(intervalId);
    // dispatch(action(timerId))
    dispatch(timerRemoved(timerId));
  };

  return (
    <section className="timers-list">
      <ul>
        {timers.map(({ id, timerName, hours, minutes, seconds, stop }) => (
          <li key={id} className={`timers-list__item ${stop ? "" : "active"}`}>
            <span className="timers-list__item-name">{timerName}</span>
            <div className="timers_list__btn-block">
              <span className="timers-list__item-value">{`${hours}:${minutes}:${seconds}`}</span>
              <button
                className="btn-round"
                onClick={() => startOrStopTimer(id)}
              >
                <span className="material-icons">
                  {stop ? "play_circle_outline" : "pause_circle_outline"}
                </span>
              </button>
              <button
                className="btn-round btn-round_remove"
                onClick={() => remove(id)}
              >
                <span className="material-icons">remove_circle_outline</span>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};
