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

// Helper function for making HTTP requests
export async function fetchHelper(
  url,
  method = "GET",
  headers = {},
  data = null
) {
  try {
    const response = await fetch(url, {
      method: method,
      headers: headers,
      body: data ? JSON.stringify(data) : null,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    // Handle any errors that occurred during the fetch
    console.error("Fetch error:", error.message);
    throw error;
  }
}
