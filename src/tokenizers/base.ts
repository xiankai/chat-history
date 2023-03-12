import { Message, Term } from "datasources/base";

interface BaseTokenizer {
  parseMessage(message: Message): Term[];

  asyncParseMessage(message: Message): Promise<Term[]>;
}

abstract class BaseTokenizer {}

export default BaseTokenizer;
