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

export const formatDate = (datetime) => {
  const date = new Date(datetime);
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);

  return formattedDate;
};
