import { CSVExport } from "components/viewer/CSVExport";
import { Messenger as MessengerViewer } from "components/viewer/Messenger/index";
import {
  ChatLogFormat,
  ChatLogFormatSource,
  Recipient,
} from "datasources/base";

export const SourceViewer = ({
  logs,
  recipient,
}: {
  logs: ChatLogFormat[];
  recipient: Recipient;
}) => {
  const logSource = logs[0][ChatLogFormatSource];

  if (logSource === "messenger") {
    return (
      <MessengerViewer logs={logs.slice().reverse()} recipient={recipient} />
    );
  }

  return <CSVExport logs={logs} recipient={recipient} />;
};
