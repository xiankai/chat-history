export type DateBucketReference = {
  year: number;
  month: number;
  day: number;
};
export type DateString = string;

export type SearchQuery = string;
export type LineNumber = number;
export type Term = string;
export type Timestamp = Date;
export type Message = string;
export type Sender = string;
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
  SourceMetadata,
  Sender
];

export const ChatLogFormatLineNumber = 0;
export const ChatLogFormatTimestamp = 1;
export const ChatLogFormatMessage = 2;
export const ChatLogFormatSource = 3;
export const ChatLogFormatSourceMetadata = 4;
export const ChatLogFormatSender = 5;

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
export type SearchResultByDate = Record<DateString, ChatLogFormat[]>;

export type Recipient = string;

export type ProgressTrackerCallback = () => number | string;

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

export interface AsyncBaseDatasource {
  addToIndex(index: Index, terms: Term[]): void;

  addToStorage(
    recipient: Recipient,
    line_number: LineNumber,
    timestamp: Timestamp,
    message: Message,
    source: Source,
    source_metadata: SourceMetadata
  ): void;

  retrieveBucketListFromStorage(source: Source): Promise<Recipient[]>;

  retrieveBucketFromStorage(
    recipient: Recipient,
    source: Source,
    date: DateBucketReference
  ): Promise<ChatLogFormat[]>;

  retrieveFirstBucketFromStorage(
    recipient: Recipient,
    source: Source
  ): Promise<ChatLogFormat[]>;

  retrieveLastBucketFromStorage(
    recipient: Recipient,
    source: Source
  ): Promise<ChatLogFormat[]>;

  deleteBucketFromStorage(recipient: Recipient, source: Source): Promise<void>;

  retrieveMessageFromStorage(
    recipient: Recipient,
    source: Source,
    date: DateBucketReference,
    message_id: number
  ): Promise<ChatLogFormat>;

  searchStorage(query: SearchQuery, source: Source): Promise<ChatLogFormat[]>;
  searchStorageByDate(
    query: SearchQuery,
    source: Source,
    recipient: Recipient
  ): Promise<SearchResultByDate>;

  bulkAddToStorage(
    recipient: Recipient,
    source: Source,
    messages: ChatLogFormat[],
    tokenizer?: (message: string) => Promise<string[]>
  ): ProgressTrackerCallback;
}
