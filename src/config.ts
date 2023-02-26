import LocalStorageDatasource from "./datasources/localstorage";
import IndexedDBDatasource from "./datasources/indexeddb";
import WhitespaceTokenizer from "./tokenizers/whitespace";
import SpacyTokenizer from "./tokenizers/spacy";
import MSN from "./formatter/msn";
import Messenger from "./formatter/messenger";
// import { Plain } from "./components/viewer/Plain";
import { CSVExport } from "./components/viewer/CSVExport";
import { Messenger as MessengerViewer } from "./components/viewer/Messenger/index";

const local_datasource = new LocalStorageDatasource();
const async_datasource = new IndexedDBDatasource();
const whitespace_tokenizer = new WhitespaceTokenizer();
const spacy_tokenizer = new SpacyTokenizer();
const MSNFormatter = new MSN();
const MessengerFormatter = new Messenger();

export {
  local_datasource,
  async_datasource,
  whitespace_tokenizer,
  spacy_tokenizer,
  MSNFormatter,
  MessengerFormatter,
  CSVExport,
  MessengerViewer,
};
