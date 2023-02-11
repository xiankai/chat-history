import {
  ChatLog,
  ChatLogFormat,
  ChatLogMetadata,
  LineNumber,
} from "datasources/base";

interface BaseFormatter {
  formatHeaders?(lines: string[]): ChatLogMetadata;

  formatMessage?(
    line_number: LineNumber,
    line: string,
    metadata?: any
  ): ChatLogFormat;
}

abstract class BaseFormatter {
  abstract formatChatLog(input: string): ChatLog;
}

export default BaseFormatter;
