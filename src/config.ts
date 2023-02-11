import LocalStorageDatasource from "./datasources/localstorage";
import WhitespaceTokenizer from "./tokenizers/whitespace";
import MSNFormatter from "./formatter/msn";
// import { Plain } from './components/viewer/Plain';
import { CSVExport } from "./components/viewer/CSVExport";

const datasource = new LocalStorageDatasource();
const tokenizer = new WhitespaceTokenizer();
const formatter = new MSNFormatter();
const ViewerComponent = CSVExport;

export { datasource, tokenizer, formatter, ViewerComponent };
