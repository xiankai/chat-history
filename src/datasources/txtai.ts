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
} from "./base";
import {
  parseDateBucketIntoDateString,
  parseTimestampIntoDateBucket,
} from "utils/date";
import { uniqueId } from "lodash";

interface TxtaiDocument {
  id: string;
  text: any;
}

export default class TxtaiDatasource implements AsyncBaseDatasource {
  base_url = "";
  embeddings;

  constructor(base_url = import.meta.env.VITE_TXTAI_URL) {
    this.base_url = base_url;

    this.embeddings = {
      index(source: Source, recipient: Recipient, documents: TxtaiDocument[]) {
        fetch(base_url + "/index", {
          method: "POST",
          body: JSON.stringify({
            source,
            recipient,
            documents,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      },
      search() {},
    };
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

  async bulkAddToStorage(
    recipient: Recipient,
    messages: ChatLogFormat[],
    tokenizer?: (message: string) => Promise<string[]>,
    progress_tracker?: (callback: () => number) => void
  ) {}

  async retrieveBucketListFromStorage(): Promise<Recipient[]> {
    throw new Error("Method not implemented.");
  }

  async retrieveBucketFromStorage(
    recipient: Recipient,
    date: DateBucketReference
  ): Promise<ChatLogFormat[]> {
    throw new Error("Method not implemented.");
  }

  async retrieveMessageFromStorage(
    recipient: Recipient,
    date: DateBucketReference,
    inserted_index: number
  ): Promise<ChatLogFormat> {
    throw new Error("Method not implemented.");
  }

  async searchStorage(query: SearchQuery): Promise<ChatLogFormat[]> {
    throw new Error("Method not implemented.");
  }

  async searchStorageByDate(
    query: SearchQuery,
    recipient: Recipient
  ): Promise<SearchResultByDate> {
    throw new Error("Method not implemented.");
  }
}
