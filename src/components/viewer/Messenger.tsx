import {
  ChatLogFormat,
  ChatLogFormatMessage,
  ChatLogFormatSourceMetadata,
  ChatLogFormatTimestamp,
} from "datasources/base";

export const Messenger = ({
  logs,
  recipient,
  date,
}: {
  recipient: string;
  date: string;
  logs: ChatLogFormat[];
}) => (
  <div
    style={{
      whiteSpace: "pre-line",
      textAlign: "left",
    }}
  >
    {logs.map((log) => {
      const { sender_name, photos, reactions, videos } =
        log[ChatLogFormatSourceMetadata];
      return (
        <div className="flex">
          {/* icon */}
          <div>
            <div>{sender_name as string}</div>{" "}
            <div>{log[ChatLogFormatTimestamp].toDateString()}</div>
            <div>{log[ChatLogFormatMessage]}</div>
          </div>
        </div>
      );
    })}
  </div>
);
