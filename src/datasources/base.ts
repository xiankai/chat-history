export type DateBucketReference = {
    year: number;
    month: number;
    day: number;
};

export type SearchQuery = string;
export type LineNumber = number;
export type Term = string;
export type Timestamp = Date;
export type Message = string;
export type Source = string;
export type SourceMetadata = object;

export type ChatLogFormat = [LineNumber, Timestamp, Message, Source, SourceMetadata];

export default abstract class BaseDatasource {
    abstract addToIndex(terms: Term[], timestamp: Timestamp, line: LineNumber): void;

    abstract addToStorage(line_number: LineNumber, timestamp: Timestamp, message: Message, source: Source, source_metadata: SourceMetadata): void;

    abstract retrieveBucketFromStorage(date: DateBucketReference): void;

    abstract retrieveMessageFromStorage(date: DateBucketReference, message_id: number): void;

    abstract searchStorage(query: SearchQuery): void;
}