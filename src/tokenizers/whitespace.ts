import { Message, Term } from "datasources/base";
import BaseTokenizer from "./base";

export default class WhitespaceTokenizer extends BaseTokenizer {
  parseMessage(message: Message): Term[] {
    return message.split(" ");
  }

  async asyncParseMessage(message: Message): Promise<Term[]> {
    return Promise.resolve(message.split(" "));
  }
}
