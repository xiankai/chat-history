import LocalStorageDatasource from "./datasources/localstorage";
import IndexedDBDatasource from "./datasources/indexeddb";
import WhitespaceTokenizer from "./tokenizers/whitespace";
import MSN from "./formatter/msn";
import Messenger from "./formatter/messenger";
// import { Plain } from "./components/viewer/Plain";
import { CSVExport } from "./components/viewer/CSVExport";
import { Messenger as MessengerViewer } from "./components/viewer/Messenger";

const local_datasource = new LocalStorageDatasource();
const async_datasource = new IndexedDBDatasource();
const tokenizer = new WhitespaceTokenizer();
const MSNFormatter = new MSN();
const MessengerFormatter = new Messenger();

export {
  local_datasource,
  async_datasource,
  tokenizer,
  MSNFormatter,
  MessengerFormatter,
  CSVExport,
  MessengerViewer,
};
