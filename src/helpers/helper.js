export const msToTime = (duration) => {
  let seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor(duration / (1000 * 60 * 60));

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  //return hours + ":" + minutes + ":" + seconds;
  return { hours, minutes, seconds };
};

export const miliseconds = (hrs, min, sec) => {
  return (
    (parseInt(hrs, 10) * 60 * 60 + parseInt(min, 10) * 60 + parseInt(sec, 10)) *
    1000
  );
};
