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
export type SourceMetadata = { sender: string };

export type Participant = {
  identifier: string;
  display_name: string;
};

export type ChatLogMetadata = {
  participants: Participant[];
  date: Date;
};

export type ChatLogFormat = [
  LineNumber,
  Timestamp,
  Message,
  Source,
  SourceMetadata
];

export type ChatLog = {
  metadata: ChatLogMetadata;
  messages: ChatLogFormat[];
};

export type Index = {
  recipient: string;
  inserted_index: number;
  timestamp: Timestamp;
};

export type SearchResult = [Recipient, DateBucketReference, LineNumber];

export type Recipient = string;

export default abstract class BaseDatasource {
  abstract addToIndex(index: Index, terms: Term[]): void;

  abstract addToStorage(
    recipient: Recipient,
    line_number: LineNumber,
    timestamp: Timestamp,
    message: Message,
    source: Source,
    source_metadata: SourceMetadata
  ): void;

  abstract retrieveBucketListFromStorage(): Recipient[];

  abstract retrieveBucketFromStorage(
    recipient: Recipient,
    date: DateBucketReference
  ): ChatLogFormat[];

  abstract retrieveMessageFromStorage(
    recipient: Recipient,
    date: DateBucketReference,
    message_id: number
  ): ChatLogFormat;

  abstract searchStorage(query: SearchQuery): ChatLogFormat[];
}
