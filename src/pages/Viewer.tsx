import { useEffect, useState } from "react";
import { async_datasource, MessengerViewer } from "../config";
import { List } from "../components/List";
import { DatePicker } from "../components/DatePicker";
import { ChatLogFormat, ChatLogFormatTimestamp } from "datasources/base";
import { DateContainer } from "components/viewer/Messenger/DateContainer";

export const Viewer = () => {
  const [recipient, select_recipient] = useState("Dean Cook");
  const [recipients, set_recipients] = useState<string[]>([]);

  useEffect(() => {
    const fetchRecipients = async () =>
      await async_datasource.retrieveBucketListFromStorage();

    fetchRecipients().then((recipients) => set_recipients(recipients));
  }, []);

  const [date, select_date] = useState(new Date("2019-08-28"));

  const [logs, set_logs] = useState<ChatLogFormat[]>([]);
  useEffect(() => {
    const fetchLogs = async () =>
      await async_datasource.retrieveBucketFromStorage(recipient, {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate() + 1,
      });

    fetchLogs().then((logs) => set_logs(logs));
  }, [date, recipient]);

  return (
    <>
      <h1>This is the chat history page</h1>
      <div className="grid grid-cols-4">
        <div className="col-span-1">
          <List
            items={recipients}
            selected_item={recipient}
            select_item={select_recipient}
          />
        </div>
        <div className="col-span-3">
          <DatePicker date={date} select_date={select_date} />
          {logs.length > 0 && (
            <DateContainer date={logs[logs.length - 1][ChatLogFormatTimestamp]}>
              <MessengerViewer
                logs={logs.slice().reverse()}
                recipient={recipient}
              />
            </DateContainer>
          )}
        </div>
      </div>
    </>
  );
};
