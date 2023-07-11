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
    date: DateBucketReference
  ): Promise<ChatLogFormat[]> {
    throw new Error("Method not implemented.");
  }
  retrieveMessageFromStorage(
    recipient: string,
    date: DateBucketReference,
    message_id: number
  ): Promise<ChatLogFormat> {
    throw new Error("Method not implemented.");
  }
  searchStorage(query: string): Promise<ChatLogFormat[]> {
    throw new Error("Method not implemented.");
  }
  searchStorageByDate(query: string): Promise<SearchResultByDate> {
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

  async bulkAddToStorage(
    recipient: Recipient,
    messages: ChatLogFormat[],
    tokenizer?: (message: string) => Promise<string[]>, // replace with embedding function
    progress_tracker?: (callback: () => number) => void
  ) {
    const docs: Document[] = messages.map((message) => ({
      pageContent: message[ChatLogFormatMessage],
      metadata: {
        timestamp_ms: message[ChatLogFormatTimestamp],
        sender_name: this.alias_sender(recipient),
      },
    }));

    await this.db.addDocuments(docs);
    console.log(this.db.memoryVectors);
    this.db.similaritySearch("haha").then(console.log);
  }
}
