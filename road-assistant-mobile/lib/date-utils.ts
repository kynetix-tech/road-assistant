export const getPrettyDateString = (dateTimeStr: string): string => {
  const dateTime = new Date(dateTimeStr);
  return dateTime.toLocaleString();
};
