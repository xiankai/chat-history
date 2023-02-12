import { FormEventHandler, useEffect, useState } from "react";
import { async_datasource, CSVExport } from "../config";
import { ChatLogFormat } from "../datasources/base";

export const Search = () => {
  const [search, setSearch] = useState("");
  const handleChange: FormEventHandler<HTMLInputElement> = (e) =>
    setSearch(e.currentTarget.value);

  const [logs, setLogs] = useState<ChatLogFormat[]>([]);
  useEffect(() => {
    if (search.length < 2) {
      return;
    }

    const searchStorage = async () => {
      return await async_datasource.searchStorage(search);
    };
    searchStorage().then((data) => setLogs(data));
  }, [search]);

  return (
    <>
      <h1>This is the search page</h1>
      <input value={search} onChange={handleChange} />
      <CSVExport
        logs={logs}
        recipient="alejandro_1701@hotmail.com"
        date="2008-11-06"
      />
    </>
  );
};
