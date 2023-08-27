import { RecipientList } from "components/RecipientList";
import { FormEventHandler, useEffect, useState } from "react";
import config_store from "stores/config_store";
import { SourceViewer } from "components/SourceViewer";
import {
  ChatLogFormatLineNumber,
  ChatLogFormatTimestamp,
  SearchResultByDate,
} from "../datasources/base";
import { DateContainer } from "components/viewer/Messenger/DateContainer";
import { SearchResultWrapper } from "components/viewer/Messenger/SearchResultWrapper";
import { parseTimestampIntoDateBucket } from "utils/date";
import { SupportedFormatter } from "formatter/base";
import { SourceList } from "components/SourceList";

export const Search = () => {
  const [source, set_source] = useState<SupportedFormatter>(
    SupportedFormatter.Messenger
  );
  const [recipient, select_recipient] = useState("");
  const [recipients, set_recipients] = useState<string[]>([]);

  useEffect(() => {
    const fetchRecipients = async () =>
      await config_store.datasource_instance.retrieveBucketListFromStorage(
        source
      );

    fetchRecipients().then((recipients) => set_recipients(recipients));
  }, [source]);

  const [search, setSearch] = useState("");
  const handleChange: FormEventHandler<HTMLInputElement> = (e) =>
    setSearch(e.currentTarget.value);

  const [search_results, set_search_results] = useState<SearchResultByDate>({});
  useEffect(() => {
    if (search.length < 2) {
      set_search_results({});
      return;
    }

    config_store.datasource_instance
      .searchStorageByDate(search, source, recipient)
      .then((data) => set_search_results(data));
  }, [search, recipient]);

  return (
    <>
      <h1>This is the search page</h1>

      <div className="grid grid-cols-4">
        <div className="col-span-1">
          <div className="ml-10 mb-0">
            <label className="label">Search Query (min length of 2)</label>
            <input
              value={search}
              onChange={handleChange}
              className="input input-bordered w-[80%]"
            />
          </div>
          <SourceList selected_item={source} select_item={set_source} />
          <RecipientList
            items={recipients}
            selected_item={recipient}
            select_item={select_recipient}
          />
        </div>
        <div className="col-span-3">
          {Object.values(search_results).map((logs) => (
            <DateContainer date={logs[0][ChatLogFormatTimestamp]}>
              {logs.map((log) => (
                <SearchResultWrapper
                  recipient={recipient}
                  dateBucketReference={parseTimestampIntoDateBucket(
                    log[ChatLogFormatTimestamp]
                  )}
                  lineNumber={log[ChatLogFormatLineNumber]}
                >
                  <SourceViewer logs={[log]} recipient={recipient} />
                </SearchResultWrapper>
              ))}
            </DateContainer>
          ))}
        </div>
      </div>
    </>
  );
};
