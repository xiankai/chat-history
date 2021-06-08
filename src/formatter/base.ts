import { ChatLogFormat, LineNumber, Message, Term } from "@/datasources/base";

export default abstract class BaseFormatter {
    abstract formatMessage(line_number: LineNumber, line: string): ChatLogFormat;
}