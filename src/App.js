import React from "react";
import "./App.css";

import { AddTimerForm } from "./features/timers/AddTimerForm";
import { TimerList } from "./features/timers/TimerList";

const App = () => {
  return (
    <div className="center">
      <h1 className="mg-0 app-name">tracker</h1>
      <AddTimerForm />
      <TimerList />
    </div>
  );
};

export default App;
