import {
  ChatLogFormat,
  ChatLogFormatLineNumber,
  ChatLogFormatMessage,
  ChatLogFormatSender,
  ChatLogFormatSource,
  ChatLogFormatSourceMetadata,
  ChatLogFormatTimestamp,
} from "datasources/base";

export const CSVExport = ({
  logs,
  recipient,
}: {
  recipient: string;
  logs: ChatLogFormat[];
}) => (
  <div
    style={{
      whiteSpace: "pre-line",
      textAlign: "left",
    }}
  >
    {logs
      .map((log) =>
        [
          log[ChatLogFormatLineNumber],
          new Date(log[ChatLogFormatTimestamp]).getTime(),
          log[ChatLogFormatMessage].replace('"', '\\"'),
          log[ChatLogFormatSource],
          log[ChatLogFormatSender],
          recipient,
          "2008-12-22",
        ]
          .map((l) => "`" + l + "`")
          .join(",")
      )
      .join("\n")}
  </div>
);
