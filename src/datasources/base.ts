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
export type SourceMetadata = Record<string, unknown>;

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

export default interface BaseDatasource {
  addToIndex(index: Index, terms: Term[]): void;

  addToStorage(
    recipient: Recipient,
    line_number: LineNumber,
    timestamp: Timestamp,
    message: Message,
    source: Source,
    source_metadata: SourceMetadata
  ): void;

  retrieveBucketListFromStorage(): Recipient[];

  retrieveBucketFromStorage(
    recipient: Recipient,
    date: DateBucketReference
  ): ChatLogFormat[];

  retrieveMessageFromStorage(
    recipient: Recipient,
    date: DateBucketReference,
    message_id: number
  ): ChatLogFormat;

  searchStorage(query: SearchQuery): ChatLogFormat[];
}
