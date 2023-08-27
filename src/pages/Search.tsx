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
import { SourceList } from "components/SourceList";
import recipient_store from "stores/recipient_store";
import { useDebounce } from "@uidotdev/usehooks";

export const Search = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 1000);
  const handleChange: FormEventHandler<HTMLInputElement> = (e) =>
    setSearch(e.currentTarget.value);

  const [search_results, set_search_results] = useState<SearchResultByDate>({});
  useEffect(() => {
    if (search.length < 2) {
      set_search_results({});
      return;
    }

    if (!recipient_store.recipient) return;

    config_store.datasource_instance
      .searchStorageByDate(
        search,
        recipient_store.source,
        recipient_store.recipient
      )
      .then((data) => set_search_results(data));
  }, [debouncedSearch]);

  return (
    <>
      <h1>This is the search page</h1>

      <div className="grid grid-cols-4">
        <div className="col-span-1">
          <div className="mb-10">
            <label className="label">Search Query (min length of 2)</label>
            <input
              value={search}
              onChange={handleChange}
              className="input input-bordered w-[80%]"
            />
          </div>
          <SourceList />
          <RecipientList />
        </div>
        <div className="col-span-3">
          {Object.values(search_results).map((logs) => (
            <DateContainer date={logs[0][ChatLogFormatTimestamp]}>
              {logs.map((log) => (
                <SearchResultWrapper
                  recipient={recipient_store.recipient!}
                  dateBucketReference={parseTimestampIntoDateBucket(
                    log[ChatLogFormatTimestamp]
                  )}
                  lineNumber={log[ChatLogFormatLineNumber]}
                >
                  <SourceViewer
                    logs={[log]}
                    recipient={recipient_store.recipient!}
                  />
                </SearchResultWrapper>
              ))}
            </DateContainer>
          ))}
        </div>
      </div>
    </>
  );
};
