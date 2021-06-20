import { createApp } from 'vue';
import App from './App.vue';
import MemoryDatasource from './datasources/memory';
import WhitespaceTokenizer from './tokenizers/whitespace';
import router from './router';
import MSNFormatter from './formatter/msn';
import './index.css';

const app = createApp(App);
app.config.globalProperties.$formatter = new MSNFormatter();
app.config.globalProperties.$tokenizer = new WhitespaceTokenizer();
app.config.globalProperties.$datasource = new MemoryDatasource();
app.config.globalProperties.$viewerComponent = 'Plain';
app.use(router).mount('#app');

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $formatter: typeof MSNFormatter;
    $tokenizer: typeof WhitespaceTokenizer;
    $datasource: typeof MemoryDatasource;
    $viewerComponent: string;
  }
}
