import { AsyncBaseDatasource } from "datasources/base";
import IndexedDBDatasource from "datasources/indexeddb";
import LocalStorageDatasource from "datasources/localstorage";
import TxtaiDatasource from "datasources/txtai";
import VectorDatasource from "datasources/vector";
import { makeAutoObservable } from "mobx";
import BaseTokenizer from "tokenizers/base";
import SpacyTokenizer from "tokenizers/spacy";
import WhitespaceTokenizer from "tokenizers/whitespace";
import MSN from "formatter/msn";
import Messenger from "formatter/messenger";
import BaseFormatter, { SupportedFormatter } from "formatter/base";
import PgvectorDatasource from "datasources/pgvector";

export type ConfigFormat = {
  data_key: string;
  label: string;
  tooltip: string;
  instance: any;
};

class config_store {
  datasources: ConfigFormat[] = [
    {
      data_key: "local",
      label: "Localstorage",
      tooltip:
        "Uses the browser's localstorage mechanism. Crude key/value store",
      instance: LocalStorageDatasource,
    },
    {
      data_key: "async",
      label: "IndexedDB",
      tooltip:
        "Uses the browser's IndexedDB mechanism. Works asynchronously, less prone to locking operations and higher storage limit.",
      instance: IndexedDBDatasource,
    },
    {
      data_key: "vector",
      label: "OpenAI",
      tooltip:
        "Uses OpenAI embeddings. Not implemented yet as no storage for created embeddings.",
      instance: VectorDatasource,
    },
    {
      data_key: "txtai",
      label: "txtai vector database",
      tooltip:
        "Uses an implementation of the txtai vector database hosted via modal.",
      instance: new TxtaiDatasource(),
    },
    {
      data_key: "pgvector",
      label: "pgvector vector database",
      tooltip:
        "Uses an implementation of pgvector vector database hosted via k8s/docker.",
      instance: new PgvectorDatasource(),
    },
  ];
  datasource: ConfigFormat["data_key"];
  get datasource_instance(): AsyncBaseDatasource {
    const datasource = this.datasources.find(
      (d) => d.data_key === this.datasource
    );
    return datasource?.instance;
  }

  tokenizers: ConfigFormat[] = [
    {
      data_key: "whitespace",
      label: "Whitespace",
      tooltip: "Uses a simple whitespace-based tokenizer.",
      instance: WhitespaceTokenizer,
    },
    {
      data_key: "spacy",
      label: "spaCy",
      tooltip: "Uses spaCy's pre-built NLP model to tokenize messages.",
      instance: SpacyTokenizer,
    },
    {
      data_key: "vector",
      label: "vector",
      tooltip:
        "Uses vector representations of text embeddings built from sentence transformers",
      instance: VectorDatasource,
    },
  ];
  tokenizer: ConfigFormat["data_key"];
  get tokenizer_instance(): BaseTokenizer {
    const instance = this.tokenizers.find(
      (d) => d.data_key === this.tokenizer
    )?.instance;
    return new instance();
  }

  msn_formatter = new MSN();
  messenger_formatter = new Messenger();
  get_formatter_instance(formatter: SupportedFormatter): BaseFormatter {
    switch (formatter) {
      case SupportedFormatter.MSN:
        return this.msn_formatter;
      case SupportedFormatter.Messenger:
        return this.messenger_formatter;
    }
  }

  get_formatters(): {
    label: string;
    value: SupportedFormatter;
  }[] {
    return Object.entries(SupportedFormatter).map(([label, value]) => ({
      label,
      value,
    }));
  }

  constructor() {
    makeAutoObservable(this);

    this.datasource = "pgvector";
    this.tokenizer = "vector";
  }
}

export default new config_store();
