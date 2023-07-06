import LocalStorageDatasource from "./datasources/localstorage";
import IndexedDBDatasource from "./datasources/indexeddb";
import VectorDatasource from "./datasources/vector";
import TxtaiDatasource from "./datasources/txtai";
import WhitespaceTokenizer from "./tokenizers/whitespace";
import SpacyTokenizer from "./tokenizers/spacy";
import VectorTokenizer from "./tokenizers/vector";
import MSN from "./formatter/msn";
import Messenger from "./formatter/messenger";
// import { Plain } from "./components/viewer/Plain";
import { CSVExport } from "./components/viewer/CSVExport";
import { Messenger as MessengerViewer } from "./components/viewer/Messenger/index";

const local_datasource = new LocalStorageDatasource();
const async_datasource = new IndexedDBDatasource();
const vector_datasource = new VectorDatasource();
const txtai_datasource = new TxtaiDatasource();
const whitespace_tokenizer = new WhitespaceTokenizer();
const vector_tokenizer = new VectorTokenizer();
const spacy_tokenizer = new SpacyTokenizer();
const MSNFormatter = new MSN();
const MessengerFormatter = new Messenger();

export {
  local_datasource,
  async_datasource,
  vector_datasource,
  txtai_datasource,
  whitespace_tokenizer,
  spacy_tokenizer,
  vector_tokenizer,
  MSNFormatter,
  MessengerFormatter,
  CSVExport,
  MessengerViewer,
};
