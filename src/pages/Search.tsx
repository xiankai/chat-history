import { List } from "components/List";
import { FormEventHandler, useEffect, useState } from "react";
import { async_datasource, CSVExport, MessengerViewer } from "../config";
import {
  ChatLogFormat,
  ChatLogFormatLineNumber,
  ChatLogFormatSource,
  ChatLogFormatTimestamp,
  SearchResultByDate,
} from "../datasources/base";
import { DateContainer } from "components/viewer/Messenger/DateContainer";

export const Search = () => {
  const [recipient, select_recipient] = useState("Dean Cook");
  const [recipients, set_recipients] = useState<string[]>([]);

  useEffect(() => {
    const fetchRecipients = async () =>
      await async_datasource.retrieveBucketListFromStorage();

    fetchRecipients().then((recipients) => set_recipients(recipients));
  }, []);

  const [search, setSearch] = useState("");
  const handleChange: FormEventHandler<HTMLInputElement> = (e) =>
    setSearch(e.currentTarget.value);

  const [search_results, set_search_results] = useState<SearchResultByDate>({});
  useEffect(() => {
    if (search.length < 2) {
      set_search_results({});
      return;
    }

    async_datasource
      .searchStorageByDate(search)
      .then((data) => set_search_results(data));
  }, [search]);

  return (
    <>
      <h1>This is the search page</h1>
      <label className="label">Search Query (min length of 2)</label>
      <input
        value={search}
        onChange={handleChange}
        className="input input-bordered"
      />

      <div className="grid grid-cols-4">
        <div className="col-span-1">
          <List
            items={recipients}
            selected_item={recipient}
            select_item={select_recipient}
          />
        </div>
        <div className="col-span-3">
          {Object.values(search_results).map((logs) => (
            <DateContainer date={logs[0][ChatLogFormatTimestamp]}>
              {logs.map((log) => (
                <MessengerViewer
                  key={log[ChatLogFormatLineNumber]}
                  logs={[log]}
                  recipient={recipient}
                />
              ))}
            </DateContainer>
          ))}
          {/* {logs.map((log) =>
            <CSVExport
              key={log[ChatLogFormatLineNumber]}
              logs={[log]}
              recipient={recipient}
            />
          )} */}
        </div>
      </div>
    </>
  );
};
