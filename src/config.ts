import LocalStorageDatasource from './datasources/localstorage';
import WhitespaceTokenizer from './tokenizers/whitespace';
import MSNFormatter from './formatter/msn';
import { Plain } from './components/viewer/Plain';

const datasource = new LocalStorageDatasource();
const tokenizer = new WhitespaceTokenizer();
const formatter = new MSNFormatter();
const ViewerComponent = Plain;

export { datasource, tokenizer, formatter, ViewerComponent };
