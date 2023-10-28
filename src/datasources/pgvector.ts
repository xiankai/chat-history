import { parseTimestampIntoDateString } from "utils/date";
import {
  AsyncBaseDatasource,
  ChatLogFormat,
  ChatLogFormatLineNumber,
  ChatLogFormatMessage,
  ChatLogFormatSender,
  ChatLogFormatSourceMetadata,
  ChatLogFormatTimestamp,
  DateBucketReference,
  Index,
  ProgressTrackerCallback,
  SearchResultByDate,
  SourceMetadata,
} from "./base";
import { DefaultService, OpenAPI } from "./pgvector/generated";
import { VITE_PGVECTOR_URL } from "../constants";

export default class PgvectorDatasource implements AsyncBaseDatasource {
  constructor(base_url = VITE_PGVECTOR_URL) {
    OpenAPI.BASE = base_url;
    // OpenAPI.WITH_CREDENTIALS = true;
  }

  addToIndex(index: Index, terms: string[]): void {
    throw new Error("Method not implemented.");
  }
  addToStorage(
    recipient: string,
    line_number: number,
    timestamp: Date,
    message: string,
    source: string,
    source_metadata: SourceMetadata
  ): void {
    throw new Error("Method not implemented.");
  }
  async retrieveBucketListFromStorage(source: string): Promise<string[]> {
    return DefaultService.recipientsRecipients({ source });
  }
  retrieveBucketFromStorage(
    recipient: string,
    source: string,
    date: DateBucketReference
  ): Promise<ChatLogFormat[]> {
    throw new Error("Method not implemented.");
  }
  retrieveFirstBucketFromStorage(
    recipient: string,
    source: string
  ): Promise<ChatLogFormat[]> {
    throw new Error("Method not implemented.");
  }
  retrieveLastBucketFromStorage(
    recipient: string,
    source: string
  ): Promise<ChatLogFormat[]> {
    throw new Error("Method not implemented.");
  }
  deleteBucketFromStorage(recipient: string, source: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  retrieveMessageFromStorage(
    recipient: string,
    source: string,
    date: DateBucketReference,
    message_id: number
  ): Promise<ChatLogFormat> {
    throw new Error("Method not implemented.");
  }
  searchStorage(query: string, source: string): Promise<ChatLogFormat[]> {
    throw new Error("Method not implemented.");
  }
  searchStorageByDate(
    query: string,
    source: string,
    recipient: string
  ): Promise<SearchResultByDate> {
    throw new Error("Method not implemented.");
  }
  bulkAddToStorage(
    recipient: string,
    source: string,
    messages: ChatLogFormat[],
    tokenizer?: ((message: string) => Promise<string[]>) | undefined
  ): {
    promise: Promise<any>;
    progress_tracker_callback: ProgressTrackerCallback;
  } {
    let finished: string | number = 0;
    const promise = DefaultService.indexIndex({
      docs: messages.map((message) => ({
        text: message[ChatLogFormatMessage],
        date: parseTimestampIntoDateString(message[ChatLogFormatTimestamp]),
        sender: message[ChatLogFormatSender],
        timestamp: +message[ChatLogFormatTimestamp] / 1000,
        line_number: message[ChatLogFormatLineNumber],
        source_metadata: message[ChatLogFormatSourceMetadata],
      })),
      recipient,
      source,
    })
      .then(() => (finished = messages.length))
      .catch((err) => (finished = JSON.stringify(err)));
    return {
      promise,
      progress_tracker_callback: () => finished,
    };
  }
}
