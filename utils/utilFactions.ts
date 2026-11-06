export const getTimezoneOffsetString = () => {
  const date = new Date();
  const offsetInMinutes = date.getTimezoneOffset();

  const sign = offsetInMinutes <= 0 ? "+" : "-";
  const offsetHours = String(
    Math.floor(Math.abs(offsetInMinutes) / 60)
  ).padStart(2, "0");
  const offsetMinutes = String(Math.abs(offsetInMinutes) % 60).padStart(2, "0");

  return `${sign}${offsetHours}:${offsetMinutes}`;
};
