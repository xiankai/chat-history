import {
  parseDateBucketIntoDateString,
  parseTimestampIntoDateString,
} from "utils/date";
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
  Message,
  ProgressTrackerCallback,
  SearchResultByDate,
  Source,
  SourceMetadata,
} from "./base";
import {
  DefaultService,
  DocumentData,
  DocumentResponse,
  OpenAPI,
} from "./pgvector/generated";
import { VITE_PGVECTOR_URL } from "../constants";
import { groupBy } from "lodash";

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
  async retrieveBucketFromStorage(
    recipient: string,
    source: string,
    date: DateBucketReference
  ): Promise<ChatLogFormat[]> {
    const response = await DefaultService.dayDay({
      recipient,
      source,
      day: parseDateBucketIntoDateString(date),
    });

    return response.map((document) =>
      this.formatMessageResponse(document, source)
    );
  }
  async retrieveFirstBucketFromStorage(
    recipient: string,
    source: string
  ): Promise<ChatLogFormat[]> {
    const response = await DefaultService.firstDayFirstDay({
      recipient,
      source,
    });

    return response.map((document) =>
      this.formatMessageResponse(document, source)
    );
  }
  async retrieveLastBucketFromStorage(
    recipient: string,
    source: string
  ): Promise<ChatLogFormat[]> {
    const response = await DefaultService.lastDayLastDay({
      recipient,
      source,
    });

    return response.map((document) =>
      this.formatMessageResponse(document, source)
    );
  }
  async deleteBucketFromStorage(
    recipient: string,
    source: string
  ): Promise<void> {
    const response = await DefaultService.deleteDelete({
      recipient,
      source,
    });
  }
  retrieveMessageFromStorage(
    recipient: string,
    source: string,
    date: DateBucketReference,
    message_id: number
  ): Promise<ChatLogFormat> {
    throw new Error("Method not implemented.");
  }
  async search(
    q: string,
    source: string,
    recipient: string
  ): Promise<SearchResultByDate> {
    const response = await DefaultService.searchSearch({
      q,
      recipient,
      source,
    });

    // group by date first
    const grouped_by_date = groupBy(response, (row) =>
      parseTimestampIntoDateString(new Date(row.timestamp))
    );

    // apply response formatter
    const formatted_entries = Object.entries(grouped_by_date).map(
      ([date, docs]) => [
        date,
        docs.map((doc) => this.formatMessageResponse(doc, source)),
      ]
    );

    // convert back to object
    const grouped_by_date_and_formatted = Object.fromEntries(formatted_entries);

    return grouped_by_date_and_formatted;
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
      requestBody: {
        docs: messages.map((message) => ({
          text: message[ChatLogFormatMessage],
          date: parseTimestampIntoDateString(message[ChatLogFormatTimestamp]),
          sender: message[ChatLogFormatSender],
          timestamp: +message[ChatLogFormatTimestamp],
          line_number: message[ChatLogFormatLineNumber],
          source_metadata: message[ChatLogFormatSourceMetadata],
        })),
        recipient,
        source,
      },
    })
      .then(() => (finished = messages.length))
      .catch((err) => (finished = JSON.stringify(err)));
    return {
      promise,
      progress_tracker_callback: () => finished,
    };
  }

  private formatMessageResponse(
    document: DocumentResponse,
    source: Source
  ): ChatLogFormat {
    return [
      document.line_number,
      new Date(document.timestamp),
      document.text,
      source,
      document.source_metadata,
      document.sender,
    ];
  }
}
