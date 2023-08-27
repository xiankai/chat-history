import { useCallback, useEffect, useState } from "react";
import config_store from "stores/config_store";
import { SourceViewer } from "components/SourceViewer";
import { RecipientList } from "../components/RecipientList";
import { DatePicker } from "../components/DatePicker";
import {
  ChatLogFormat,
  ChatLogFormatTimestamp,
  Recipient,
  Source,
} from "datasources/base";
import { DateContainer } from "components/viewer/Messenger/DateContainer";
import { useQueryParams } from "raviger";
import { isValidDate, parseDateIntoDateBucket } from "utils/date";
import { SourceList } from "components/SourceList";
import { Loading } from "components/Loading";
import recipient_store from "stores/recipient_store";
import { observer } from "mobx-react-lite";

export const Viewer = observer(() => {
  const [search_result] = useQueryParams();
  const [loading, set_loading] = useState(!!search_result.recipient);

  const get_first_day = (recipient: Recipient, source: Source) => {
    set_loading(true);
    const fetchLogs = async () =>
      await config_store.datasource_instance.retrieveFirstBucketFromStorage(
        recipient,
        source
      );

    fetchLogs().then((logs) => {
      set_logs(logs);
      select_date(logs[0][ChatLogFormatTimestamp]);
      set_loading(false);
    });
  };

  const [date, select_date] = useState(new Date(search_result.date));

  const [logs, set_logs] = useState<ChatLogFormat[]>([]);
  useEffect(() => {
    // Cannot fetch data without a recipient
    if (!recipient_store.recipient) {
      return;
    }

    // If recipient but no date, fetch the first day
    if (!isValidDate(date)) {
      get_first_day(recipient_store.recipient, recipient_store.source);
      return;
    }

    set_loading(true);

    config_store.datasource_instance
      .retrieveBucketFromStorage(
        recipient_store.recipient,
        recipient_store.source,
        parseDateIntoDateBucket(date)
      )
      .then((logs) => {
        set_logs(logs);

        // Scroll to the line if it exists
        if (search_result.line) {
          const line_number = parseInt(search_result.line);
          const line = document.querySelector(
            `[data-line-number="${line_number}"]`
          );
          if (line) {
            line.scrollIntoView();
          }
        }

        set_loading(false);
      });
  }, [date, recipient_store.recipient]);

  return (
    <>
      <h1>This is the chat history page</h1>
      {/* This makes the page take up all the space minus 38px from the header and 42px from the header's margins */}
      <div
        className="grid grid-cols-4 h-[calc(100%-80px)]"
        style={{ gridTemplateRows: "90px 1fr" }} // 90px is from <SourceList />
      >
        <div className="col-span-1 row-span-1">
          <SourceList />
        </div>
        <div className="col-span-1 row-start-2">
          <RecipientList
            select_recipient_callback={(recipient) => {
              // if selecting new recipient
              if (recipient !== recipient_store.recipient) {
                // set invalid date, so that useEffect will fetch the first day instead
                select_date(new Date("Invalid Date"));
              }
            }}
          />
        </div>
        <div className="col-span-3 col-start-2 m-auto">
          <DatePicker date={date} select_date={select_date} />
        </div>
        <div className="col-span-3 row-start-2">
          {!recipient_store.recipient ? (
            <div className="flex justify-center h-full items-center">
              <span>Select a recipient to view the first message</span>
            </div>
          ) : loading ? (
            <div className="flex justify-center h-full">
              <Loading />
            </div>
          ) : logs.length > 0 ? (
            <DateContainer date={logs[logs.length - 1][ChatLogFormatTimestamp]}>
              <SourceViewer
                logs={logs.slice().reverse()}
                recipient={recipient_store.recipient}
              />
            </DateContainer>
          ) : (
            <span>No messages for this day</span>
          )}
        </div>
      </div>
    </>
  );
});
