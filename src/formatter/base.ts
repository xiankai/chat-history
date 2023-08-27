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

  abstract getRecipient(metadata: ChatLogMetadata): string;

  abstract isValidFileFormat(file: FileSystemFileHandle): boolean;
}

export default BaseFormatter;

export enum SupportedFormatter {
  Messenger = "messenger",
  MSN = "MSN",
}

export const supported_formatters: SupportedFormatter[] = [
  SupportedFormatter.MSN,
  SupportedFormatter.Messenger,
];
