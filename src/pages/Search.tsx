import { FormEventHandler, useEffect, useState } from 'react';
import { datasource, ViewerComponent } from '../config';
import { ChatLogFormat } from '../datasources/base';

export const Search = () => {
  const [search, setSearch] = useState('');
  const handleChange: FormEventHandler<HTMLInputElement> = (e) =>
    setSearch(e.currentTarget.value);

  const [logs, setLogs] = useState<ChatLogFormat[]>([]);
  useEffect(() => {
    if (search.length < 2) {
      return;
    }

    setLogs(datasource.searchStorage(search));
  }, [search]);

  return (
    <>
      <h1>This is the search page</h1>
      <input value={search} onChange={handleChange} />
      <ViewerComponent logs={logs} />
    </>
  );
};
