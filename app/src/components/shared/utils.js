export const isHappening = (startTime, endTime) => {
  if (endTime === null) {
    return true;
  }
  let currentTime = new Date().getTime();

  return startTime <= currentTime && currentTime <= endTime;
};

export const hasPast = (endTime) => {
  if (endTime === null) {
    return false;
  }
  let currentTime = new Date().getTime();

  return endTime <= currentTime;
};

export const inFuture = (startTime, endTime) => {
  return !isHappening(startTime, endTime) && !hasPast(endTime);
};
