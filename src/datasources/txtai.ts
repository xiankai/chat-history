import {
  AsyncBaseDatasource,
  DateBucketReference,
  ChatLogFormat,
  SourceMetadata,
  SearchQuery,
  Index,
  SearchResult,
  Recipient,
  ChatLogFormatSource,
  ChatLogFormatTimestamp,
  ChatLogFormatMessage,
  SearchResultByDate,
  ChatLogFormatLineNumber,
  Source,
  ChatLogFormatSourceMetadata,
} from "./base";
import {
  parseDateBucketIntoDateString,
  parseTimestampIntoDateBucket,
  parseTimestampIntoDateString,
} from "utils/date";
import { uniqueId } from "lodash";
import { VITE_TXTAI_URL } from "../constants";
import { DefaultService, DocumentDataFull, OpenAPI } from "./txtai/generated";
import Cookies from "js-cookie";

interface TxtaiDocument {
  id: string;
  text: any;
}

export default class TxtaiDatasource implements AsyncBaseDatasource {
  constructor(base_url = VITE_TXTAI_URL) {
    OpenAPI.BASE = base_url;
    OpenAPI.WITH_CREDENTIALS = true;
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
  private getKey = (
    recipient: Recipient,
    date_string: string,
    index: number
  ): string => {
    return [recipient, date_string, index].join("-");
  };

  private tokenizer(
    message: ChatLogFormat,
    recipient: Recipient
  ): TxtaiDocument {
    const date_bucket = parseTimestampIntoDateBucket(
      message[ChatLogFormatTimestamp]
    );
    const date_string = parseDateBucketIntoDateString(date_bucket);
    return {
      id: uniqueId(),
      text: message[ChatLogFormatMessage],
      // text: {
      //   text: message[ChatLogFormatMessage],
      //   // recipient,
      //   // source: message[ChatLogFormatSource],
      //   // date: date_string,
      //   // timestamp: message[ChatLogFormatTimestamp],
      // },
    };
  }

  private formatTxtaiResponse(document: DocumentDataFull): ChatLogFormat {
    return [
      document.line_number,
      new Date(document.timestamp * 1000),
      document.text,
      document.source,
      JSON.parse(document.source_metadata),
    ];
  }

  bulkAddToStorage(
    recipient: Recipient,
    source: Source,
    messages: ChatLogFormat[]
  ) {
    let finished: string | number = 0;
    DefaultService.indexIndexPost({
      requestBody: {
        source,
        recipient,
        docs: messages.map((message) => ({
          text: message[ChatLogFormatMessage],
          date: parseTimestampIntoDateString(message[ChatLogFormatTimestamp]),
          recipient: message[ChatLogFormatSourceMetadata][
            "sender_name"
          ] as string,
          timestamp: +message[ChatLogFormatTimestamp] / 1000,
          line_number: message[ChatLogFormatLineNumber],
          source_metadata: message[ChatLogFormatSourceMetadata],
        })),
      },
      firebaseToken: Cookies.get("firebase_token"),
    })
      .then(() => (finished = messages.length))
      .catch((err) => (finished = JSON.stringify(err)));
    return () => finished;
  }

  async retrieveBucketListFromStorage(): Promise<Recipient[]> {
    return DefaultService.recipientsRecipientsGet({
      firebaseToken: Cookies.get("firebase_token"),
    });
  }

  async retrieveBucketFromStorage(
    recipient: Recipient,
    source: Source,
    date: DateBucketReference
  ): Promise<ChatLogFormat[]> {
    const response = await DefaultService.dayDayGet({
      date: parseDateBucketIntoDateString(date),
      recipient,
      source,
      firebaseToken: Cookies.get("firebase_token"),
    });

    return response.map(this.formatTxtaiResponse);
  }

  async retrieveFirstBucketFromStorage(
    recipient: string,
    source: string
  ): Promise<ChatLogFormat[]> {
    const response = await DefaultService.dayFirstDayGet({
      recipient,
      source,
      firebaseToken: Cookies.get("firebase_token"),
    });

    return response.map(this.formatTxtaiResponse);
  }

  async retrieveLastBucketFromStorage(
    recipient: string,
    source: string
  ): Promise<ChatLogFormat[]> {
    const response = await DefaultService.dayLastDayGet({
      recipient,
      source,
      firebaseToken: Cookies.get("firebase_token"),
    });

    return response.map(this.formatTxtaiResponse);
  }

  async deleteBucketFromStorage(
    recipient: string,
    source: string
  ): Promise<void> {
    const response = await DefaultService.deleteDeleteDelete({
      recipient,
      source,
      firebaseToken: Cookies.get("firebase_token"),
    });
  }

  async retrieveMessageFromStorage(
    recipient: Recipient,
    source: Source,
    date: DateBucketReference,
    inserted_index: number
  ): Promise<ChatLogFormat> {
    throw new Error("Method not implemented.");
  }

  async searchStorage(query: SearchQuery): Promise<ChatLogFormat[]> {
    const response = await DefaultService.searchSearchGet({
      q: query,
      firebaseToken: Cookies.get("firebase_token"),
    });

    return response.map(this.formatTxtaiResponse);
  }

  async searchStorageByDate(
    query: SearchQuery,
    recipient: Recipient
  ): Promise<SearchResultByDate> {
    throw new Error("Method not implemented.");
  }
}
