import {
  DateBucketReference,
  DateString,
  Timestamp,
} from "../datasources/base";

export const parseTimestampIntoDateBucket = (
  timestamp: Timestamp
): DateBucketReference => {
  const date = new Date(timestamp);
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
};

export const parseTimestampIntoDateString = (
  timestamp: Timestamp
): DateString =>
  parseDateBucketIntoDateString(parseTimestampIntoDateBucket(timestamp));

export const parseDateIntoDateBucket = (date: Date): DateBucketReference => {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
};

export const parseDateBucketIntoDateString = (
  date_bucket: DateBucketReference
): DateString => {
  return [
    date_bucket.year,
    date_bucket.month.toString().padStart(2, "0"),
    date_bucket.day.toString().padStart(2, "0"),
  ].join("-");
};

export const isValidDate = (date?: Date): date is Date => {
  if (!date) return false;
  return !isNaN(date.getTime());
};

// YYYY-MM-DD
export const formatDate = (date?: Date): string => {
  if (!isValidDate(date)) {
    return "";
  }

  return [
    date.getFullYear(),
    (date.getMonth() + 1).toString().padStart(2, "0"),
    date.getDate().toString().padStart(2, "0"),
  ].join("-");
};

export const formatDurationFromSeconds = (seconds: number) =>
  new Date(1000 * seconds).toISOString().substring(11, 19);

export const formatDurationFromMilliseconds = (milliseconds: number) =>
  new Date(milliseconds).toISOString().substring(11, 19);
