import { Message, Term } from "datasources/base";

interface BaseTokenizer {
  parseMessage(message: Message): Term[];
}

abstract class BaseTokenizer {}

export default BaseTokenizer;
