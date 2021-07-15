import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = [];

export const timerStarted = createAsyncThunk(
  "timers/timerStarted",
  (timerId, thunkAPI) => {
    const intervalId = setInterval(
      () => thunkAPI.dispatch(timerTick(timerId)),
      1000
    );

    return { intervalId, timerId };
  }
);

export const timersStartedAfterLoad = createAsyncThunk(
  "timers/timersStartedAfterLoad",
  (args, thunkAPI) => {
    const { timers } = thunkAPI.getState();
    const timersWithInterval = timers.map((timer) => {
      let intervalId;
      if (!timer.stop) {
        intervalId = setInterval(
          () => thunkAPI.dispatch(timerTick(timer.id)),
          1000
        );
      }
      return { timerId: timer.id, intervalId };
    });
    return timersWithInterval;
  }
);

const timersSlice = createSlice({
  name: "timers",
  initialState,
  reducers: {
    timerAdded(state, action) {
      state.unshift(action.payload);
    },
    timersAddedFromStorage(state, action) {
      state.unshift(...action.payload);
    },
    timerRemoved(state, action) {
      const timerIdx = state.findIndex((timer) => timer.id === action.payload);
      state.splice(timerIdx, 1);
    },
    timerStopped(state, action) {
      const timer = state.find((timer) => timer.id === action.payload);
      timer.stop = !timer.stop;
      timer.intervalId = null;
    },
    timerTick(state, action) {
      const timer = state.find((timer) => timer.id === action.payload);
      timer.seconds = ++timer.seconds;
      if (timer.seconds < 10) {
        timer.seconds = "0" + timer.seconds;
      }
      if (timer.seconds > 59) {
        timer.seconds = "00";
        timer.minutes = ++timer.minutes;
        if (timer.minutes < 10) {
          timer.minutes = "0" + timer.minutes;
        }
        if (timer.minutes > 59) {
          timer.minutes = "00";
          timer.hours = ++timer.hours;
          if (timer.hours < 10) {
            timer.hours = "0" + timer.hours;
          }
        }
      }
    },
  },
  extraReducers: {
    [timerStarted.fulfilled]: (state, action) => {
      const { intervalId, timerId } = action.payload;
      const timer = state.find((timer) => timer.id === timerId);
      timer.stop = !timer.stop;
      timer.intervalId = intervalId;
    },
    [timersStartedAfterLoad.fulfilled]: (state, action) => {
      action.payload.forEach((timerWithInterval) => {
        const { timerId, intervalId } = timerWithInterval;
        const timer = state.find((timer) => timer.id === timerId);
        timer.intervalId = intervalId;
      });
    },
  },
});

export const {
  timerAdded,
  timerStopped,
  timerTick,
  timerRemoved,
  timersAddedFromStorage,
} = timersSlice.actions;

export default timersSlice.reducer;
