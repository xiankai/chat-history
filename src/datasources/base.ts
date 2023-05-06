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

export const ChatLogFormatLineNumber = 0;
export const ChatLogFormatTimestamp = 1;
export const ChatLogFormatMessage = 2;
export const ChatLogFormatSource = 3;
export const ChatLogFormatSourceMetadata = 4;

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

  retrieveBucketListFromStorage(): Promise<Recipient[]>;

  retrieveBucketFromStorage(
    recipient: Recipient,
    date: DateBucketReference
  ): Promise<ChatLogFormat[]>;

  retrieveMessageFromStorage(
    recipient: Recipient,
    date: DateBucketReference,
    message_id: number
  ): Promise<ChatLogFormat>;

  searchStorage(query: SearchQuery): Promise<ChatLogFormat[]>;
  searchStorageByDate(query: SearchQuery): Promise<SearchResultByDate>;
}
