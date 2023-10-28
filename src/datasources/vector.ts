import {
  AsyncBaseDatasource,
  ChatLogFormat,
  ChatLogFormatMessage,
  ChatLogFormatTimestamp,
  DateBucketReference,
  Index,
  Recipient,
  SearchResultByDate,
  SourceMetadata,
} from "./base";

import { MemoryVectorStore } from "langchain/vectorstores/memory";
// import { Chroma } from "langchain/vectorstores/chroma";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Document } from "langchain/document";
import { VITE_OPENAI_API_KEY } from "../constants";

export default class VectorDatasource implements AsyncBaseDatasource {
  db;
  constructor() {
    this.db = new MemoryVectorStore(
      new OpenAIEmbeddings({
        openAIApiKey: VITE_OPENAI_API_KEY,
      })
    );
    // this.db = new Chroma(
    //   new OpenAIEmbeddings({
    //     openAIApiKey: VITE_OPENAI_API_KEY,
    //   }),
    //   {
    //     collectionName: "langchain",
    //   }
    // );
  }
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
  ): void {}
  retrieveBucketListFromStorage(): Promise<string[]> {
    throw new Error("Method not implemented.");
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
  retrieveMessageFromStorage(
    recipient: string,
    source: string,
    date: DateBucketReference,
    message_id: number
  ): Promise<ChatLogFormat> {
    throw new Error("Method not implemented.");
  }
  search(query: string): Promise<SearchResultByDate> {
    throw new Error("Method not implemented.");
  }

  alias_sender(recipient: Recipient) {
    switch (recipient) {
      case "Dean Cook":
        return "KJ";
      case "Chia Kang Jin":
        return "DC";
    }
  }

  bulkAddToStorage(
    recipient: Recipient,
    source: string,
    messages: ChatLogFormat[],
    tokenizer?: (message: string) => Promise<string[]> // replace with embedding function
  ) {
    const docs: Document[] = messages.map((message) => ({
      pageContent: message[ChatLogFormatMessage],
      metadata: {
        timestamp_ms: message[ChatLogFormatTimestamp],
        sender_name: this.alias_sender(recipient),
      },
    }));

    let progress = 0;
    const promise = this.db
      .addDocuments(docs)
      .then(() => (progress = messages.length));
    return {
      promise,
      progress_tracker_callback: () => progress,
    };
  }
}
