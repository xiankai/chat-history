import { OpenAI } from "langchain/llms/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Message, Term } from "datasources/base";
import BaseTokenizer from "./base";

export default class VectorTokenizer extends BaseTokenizer {
  constructor() {
    super();
  }

  initialize() {
    const embeddings = new OpenAIEmbeddings();
  }

  parseMessage(message: Message): Term[] {
    return message.split(" ");
  }

  async asyncParseMessage(message: Message): Promise<Term[]> {
    return Promise.resolve(message.split(" "));
  }
}
