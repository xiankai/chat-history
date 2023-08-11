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
  return [date_bucket.year, date_bucket.month, date_bucket.day].join("-");
};

export const isValidDate = (date: Date): boolean => {
  return !isNaN(date.getTime());
};
