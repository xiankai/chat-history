import { DateBucketReference, Timestamp } from "../datasources/base";

export const parseTimestampIntoDateBucket = (timestamp: Timestamp): DateBucketReference => {
    const date = new Date(timestamp);
    return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate() + 1,
    }
};