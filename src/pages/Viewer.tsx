import { useEffect, useState } from "react";
import { async_datasource, MessengerViewer } from "../config";
import { RecipientList } from "../components/RecipientList";
import { DatePicker } from "../components/DatePicker";
import { ChatLogFormat, ChatLogFormatTimestamp } from "datasources/base";
import { DateContainer } from "components/viewer/Messenger/DateContainer";
import { useQueryParams } from "raviger";

export const Viewer = () => {
  const [search_result] = useQueryParams();
  const [recipient, select_recipient] = useState(
    search_result.recipient || "Dean Cook"
  );
  const [recipients, set_recipients] = useState<string[]>([]);

  useEffect(() => {
    const fetchRecipients = async () =>
      await async_datasource.retrieveBucketListFromStorage();

    fetchRecipients().then((recipients) => set_recipients(recipients));
  }, []);

  const [date, select_date] = useState(
    new Date(search_result.date || "2019-08-28")
  );

  const [logs, set_logs] = useState<ChatLogFormat[]>([]);
  useEffect(() => {
    const fetchLogs = async () =>
      await async_datasource.retrieveBucketFromStorage(recipient, {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate() + 1,
      });

    fetchLogs().then((logs) => {
      set_logs(logs);
      if (search_result.line) {
        const line_number = parseInt(search_result.line);
        const line = document.querySelector(
          `[data-line-number="${line_number}"]`
        );
        if (line) {
          line.scrollIntoView();
        }
      }
    });
  }, [date, recipient]);

  return (
    <>
      <h1>This is the chat history page</h1>
      <div className="grid grid-cols-4">
        <div className="col-span-1">
          <RecipientList
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
