import { useCallback, useEffect, useState } from "react";
import ConfigStore from "config_store";
import { SourceViewer } from "components/SourceViewer";
import { RecipientList } from "../components/RecipientList";
import { DatePicker } from "../components/DatePicker";
import {
  ChatLogFormat,
  ChatLogFormatTimestamp,
  Recipient,
} from "datasources/base";
import { DateContainer } from "components/viewer/Messenger/DateContainer";
import { useQueryParams } from "raviger";
import { isValidDate, parseDateIntoDateBucket } from "utils/date";
import { SupportedFormatter } from "formatter/base";
import { SourceList } from "components/SourceList";

export const Viewer = () => {
  const [search_result] = useQueryParams();
  const [source, set_source] = useState<SupportedFormatter>(
    SupportedFormatter.Messenger
  );
  const [recipient, set_recipient] = useState(search_result.recipient);
  const select_recipient = (new_recipient: Recipient) => {
    if (recipient !== new_recipient) {
      // set invalid date, so that useEffect will fetch the first day instead
      select_date(new Date("Invalid Date"));
      set_recipient(new_recipient);
    }
  };

  const get_first_day = (recipient: Recipient, source: SupportedFormatter) => {
    const fetchLogs = async () =>
      await ConfigStore.datasource_instance.retrieveFirstBucketFromStorage(
        recipient,
        source
      );

    fetchLogs().then((logs) => {
      set_logs(logs);
      select_date(logs[0][ChatLogFormatTimestamp]);
    });
  };

  const [recipients, set_recipients] = useState<string[]>([]);
  const fetch_recipients = async () =>
    await ConfigStore.datasource_instance.retrieveBucketListFromStorage();

  useEffect(() => {
    fetch_recipients().then((recipients) => set_recipients(recipients));
  }, []);

  const [date, select_date] = useState(new Date(search_result.date));

  const [logs, set_logs] = useState<ChatLogFormat[]>([]);
  useEffect(() => {
    // Cannot fetch data without a recipient
    if (!recipient) {
      return;
    }

    // If recipient but no date, fetch the first day
    if (!isValidDate(date)) {
      get_first_day(recipient, source);
      return;
    }

    const fetchLogs = async () =>
      await ConfigStore.datasource_instance.retrieveBucketFromStorage(
        recipient,
        source,
        parseDateIntoDateBucket(date)
      );

    fetchLogs().then((logs) => {
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
    });
  }, [date, recipient]);

  const delete_recipient = useCallback(
    (recipient: Recipient) => {
      if (!window.confirm(`Delete ${recipient}?`)) {
        return;
      }

      const deleteRecipient = async () => {
        await ConfigStore.datasource_instance.deleteBucketFromStorage(
          recipient,
          source
        );
      };

      deleteRecipient().then(fetch_recipients);
    },
    [recipient]
  );

  return (
    <>
      <h1>This is the chat history page</h1>
      <div className="tabs">
        <SourceList select_item={set_source} selected_item={source} />
      </div>
      <div className="grid grid-cols-4">
        <div className="col-span-1">
          <RecipientList
            items={recipients}
            selected_item={recipient}
            select_item={select_recipient}
            delete_item={delete_recipient}
          />
        </div>
        <div className="col-span-3">
          <DatePicker date={date} select_date={select_date} />
          {logs.length > 0 && (
            <DateContainer date={logs[logs.length - 1][ChatLogFormatTimestamp]}>
              <SourceViewer
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
