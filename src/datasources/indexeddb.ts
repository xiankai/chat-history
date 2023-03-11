import { get, set, setMany, update, createStore, keys } from "idb-keyval";
import groupBy from "lodash/groupBy";
import { parseTimestampIntoDateBucket } from "utils/date";
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
} from "./base";

const recipientStore = createStore("recipients", "keyval");
const termStore = createStore("terms", "keyval");
const logStore = createStore("logs", "keyval");

export default class IndexedDBDatasource implements AsyncBaseDatasource {
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
  private getDateKey = (date: DateBucketReference): string => {
    const { year, month, day } = date;
    return [year, month, day].join("-");
  };
  private getLogKey = (
    recipient: Recipient,
    date: DateBucketReference
  ): string => {
    return [recipient, this.getDateKey(date)].join("-");
  };

  async bulkAddToStorage(
    recipient: Recipient,
    messages: ChatLogFormat[],
    tokenizer?: (message: string) => string[]
  ) {
    set(recipient, messages[0][ChatLogFormatSource], recipientStore);

    const grouped_messages = groupBy(messages, (message) =>
      this.getLogKey(
        recipient,
        parseTimestampIntoDateBucket(message[ChatLogFormatTimestamp])
      )
    );

    const insertedMessages: { [key: string]: [ChatLogFormat] } = {};
    const insertedTerms = [];
    for (const key in grouped_messages) {
      const messages = grouped_messages[key];
      for (const index in messages) {
        const message = messages[index];
        const date = parseTimestampIntoDateBucket(
          message[ChatLogFormatTimestamp]
        );

        if (insertedMessages[key]) {
          insertedMessages[key].push(message);
        } else {
          insertedMessages[key] = [message];
        }

        if (tokenizer) {
          const terms = tokenizer(message[ChatLogFormatMessage]);
          insertedTerms.push(
            ...terms.map((term) => ({ term, recipient, date, index }))
          );
        }
      }
    }

    setMany(Object.entries(insertedMessages), logStore);
    insertedTerms.forEach(({ term, recipient, date, index }, i) => {
      update(
        term,
        (existingReferences) => {
          if (Array.isArray(existingReferences)) {
            existingReferences.push([recipient, date, index]);
            return existingReferences;
          } else {
            return [[recipient, date, index]];
          }
        },
        termStore
      );
    });
  }

  async retrieveBucketListFromStorage(): Promise<Recipient[]> {
    return (await keys(recipientStore)) || [];
  }

  async retrieveBucketFromStorage(
    recipient: Recipient,
    date: DateBucketReference
  ): Promise<ChatLogFormat[]> {
    const date_bucket = await get(this.getLogKey(recipient, date), logStore);
    return date_bucket || [];
  }

  async retrieveMessageFromStorage(
    recipient: Recipient,
    date: DateBucketReference,
    inserted_index: number
  ): Promise<ChatLogFormat> {
    const date_bucket = await get(this.getLogKey(recipient, date), logStore);
    return date_bucket[inserted_index];
  }

  async searchStorage(query: SearchQuery): Promise<ChatLogFormat[]> {
    const stored_indices: SearchResult[] = (await get(query, termStore)) || [];
    return await Promise.all(
      stored_indices.map(
        async ([recipient, date, inserted_index]) =>
          (await this.retrieveMessageFromStorage(
            recipient,
            date,
            inserted_index
          )) || []
      )
    );
  }
}
