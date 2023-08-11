import { get, set, setMany, update, createStore, keys } from "idb-keyval";
import groupBy from "lodash/groupBy";
import union from "lodash/union";
import {
  parseDateBucketIntoDateString,
  parseTimestampIntoDateBucket,
} from "utils/date";
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
  Source,
} from "./base";

const recipientStore = createStore("recipients", "keyval");
const termStore = createStore("terms", "keyval");
const logStore = createStore("logs", "keyval");

export default class IndexedDBDatasource implements AsyncBaseDatasource {
  deleteBucketFromStorage(recipient: string, source: string): Promise<void> {
    throw new Error("Method not implemented.");
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
  private getDateKey = (date: DateBucketReference): string => {
    const { year, month, day } = date;
    return [year, month, day].join("-");
  };
  private getLogKey = (
    recipient: Recipient,
    source: Source,
    date: DateBucketReference
  ): string => {
    return [recipient, this.getDateKey(date)].join("-");
  };

  bulkAddToStorage(
    recipient: Recipient,
    source: Source,
    messages: ChatLogFormat[],
    tokenizer?: (message: string) => Promise<string[]>
  ) {
    set(recipient, messages[0][ChatLogFormatSource], recipientStore);

    const grouped_messages = groupBy(messages, (message) =>
      this.getLogKey(
        recipient,
        source,
        parseTimestampIntoDateBucket(message[ChatLogFormatTimestamp])
      )
    );

    let progress = 0;
    const progress_tracker_callback = () => progress;

    const insertedMessages: { [key: string]: [ChatLogFormat] } = {};
    const insertedTerms: {
      term: string;
      recipient: Recipient;
      date: DateBucketReference;
      index: string;
    }[] = [];
    (async () => {
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
            const terms = await tokenizer(message[ChatLogFormatMessage]);
            insertedTerms.push(
              ...terms.map((term) => ({ term, recipient, date, index }))
            );
          }

          progress++;
        }
      }
    })();

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

    return progress_tracker_callback;
  }

  async retrieveBucketListFromStorage(): Promise<Recipient[]> {
    return (await keys(recipientStore)) || [];
  }

  async retrieveBucketFromStorage(
    recipient: Recipient,
    source: Source,
    date: DateBucketReference
  ): Promise<ChatLogFormat[]> {
    const date_bucket = await get(
      this.getLogKey(recipient, source, date),
      logStore
    );
    return date_bucket || [];
  }

  async retrieveMessageFromStorage(
    recipient: Recipient,
    source: Source,
    date: DateBucketReference,
    inserted_index: number
  ): Promise<ChatLogFormat> {
    const date_bucket = await get(
      this.getLogKey(recipient, source, date),
      logStore
    );
    return date_bucket[inserted_index];
  }

  async searchStorage(
    query: SearchQuery,
    source: Source
  ): Promise<ChatLogFormat[]> {
    const stored_indices: SearchResult[] = (await get(query, termStore)) || [];
    const messages = await Promise.all(
      stored_indices.map(
        async ([recipient, date, inserted_index]) =>
          await this.retrieveMessageFromStorage(
            recipient,
            source,
            date,
            inserted_index
          )
      )
    );
    return messages.filter(Boolean);
  }

  async searchStorageByDate(
    query: SearchQuery,
    source: Source,
    recipient: Recipient
  ): Promise<SearchResultByDate> {
    const stored_indices: SearchResult[] = (await get(query, termStore)) || [];

    const messages_by_date: SearchResultByDate = {};
    await Promise.all(
      stored_indices.map(async ([searched_recipient, date, inserted_index]) => {
        if (recipient && searched_recipient !== recipient) {
          return Promise.resolve();
        }

        const message = await this.retrieveMessageFromStorage(
          recipient,
          source,
          date,
          inserted_index
        );

        if (!message) {
          return Promise.resolve();
        }

        const date_string = parseDateBucketIntoDateString(date);
        messages_by_date[date_string] = union(messages_by_date[date_string], [
          message,
        ]);

        return Promise.resolve();
      })
    );
    return messages_by_date;
  }
}
