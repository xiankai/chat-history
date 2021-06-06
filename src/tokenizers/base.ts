import { Message, Term } from "@/datasources/base";

export default abstract class Tokenizer {
    abstract parseMessage(message: Message): Term[];
}