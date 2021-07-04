import {
  ChatLog,
  ChatLogFormat,
  ChatLogMetadata,
  LineNumber,
} from 'datasources/base';

export default abstract class BaseFormatter {
  abstract formatHeaders(lines: string[]): ChatLogMetadata;

  abstract formatMessage(
    line_number: LineNumber,
    line: string,
    metadata?: any
  ): ChatLogFormat;

  abstract formatChatLog(input: string): ChatLog;
}
