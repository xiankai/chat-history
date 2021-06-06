import { ChatLogFormat, Message, Term } from "@/datasources/base";

export default abstract class BaseFormatter {
    abstract formatMessage(line: string): ChatLogFormat;
}