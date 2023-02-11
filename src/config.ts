import LocalStorageDatasource from "./datasources/localstorage";
import WhitespaceTokenizer from "./tokenizers/whitespace";
import MSN from "./formatter/msn";
import Messenger from "./formatter/messenger";
// import { Plain } from "./components/viewer/Plain";
import { CSVExport } from "./components/viewer/CSVExport";

const datasource = new LocalStorageDatasource();
const tokenizer = new WhitespaceTokenizer();
const MSNFormatter = new MSN();
const MessengerFormatter = new Messenger();
const ViewerComponent = CSVExport;

export {
  datasource,
  tokenizer,
  MSNFormatter,
  MessengerFormatter,
  ViewerComponent,
};
