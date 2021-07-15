import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { timerAdded, timerStarted } from "./timersSlice";

export const AddTimerForm = () => {
  const [timerName, setTimerName] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    const timer = {
      id: Math.random(),
      stop: true,
      hours: "00",
      minutes: "00",
      seconds: "00",
    };
    // Если инпут пустой имя формируется на основе даты
    if (timerName) {
      timer.timerName = timerName;
    } else {
      const tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
      const dateTemplate = new Date(Date.now() - tzoffset)
        .toISOString()
        .split("T");
      timer.timerName = `${dateTemplate[0]} ${dateTemplate[1].slice(0, -5)}`;
    }

    dispatch(timerAdded(timer));
    dispatch(timerStarted(timer.id));
    setTimerName("");
  };

  return (
    <form onSubmit={handleSubmit} className="tracker-form">
      <div className="input__wrapper">
        <input
          type="text"
          className="tracker-form__input"
          placeholder="Enter tracker name"
          value={timerName}
          onChange={(e) => setTimerName(e.target.value.trim())}
        ></input>
        <button type="submit" className="tracker-form__submit">
          <span className="material-icons">play_arrow</span>
        </button>
      </div>
    </form>
  );
};
