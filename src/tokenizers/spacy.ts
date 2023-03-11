import { Message, Term } from "datasources/base";
import BaseTokenizer from "./base";
import uniqueId from "lodash/uniqueId";

type WorkerSuccessSignature = { results: unknown; id: string };
type WorkerErrorSignature = { error: string; id: string };
type WorkerCallbackSignature = WorkerSuccessSignature & WorkerErrorSignature;
type WorkerCallback = (value: WorkerCallbackSignature) => void;

export default class SpacyTokenizer extends BaseTokenizer {
  pyodideWorker;

  tokenizing_script = (sentence: string) => `
    tokenize("${sentence}")
  `;

  callbacks: Record<string, WorkerCallback> = {};

  constructor() {
    super();

    this.pyodideWorker = new Worker("./spacy_webworker.js", {
      type: "classic",
    });

    this.pyodideWorker.onmessage = (event) => {
      const { id, ...data } = event.data;
      const onSuccess = this.callbacks[id];
      delete this.callbacks[id];
      onSuccess(data);
    };
  }

  postMessage(python: string, context?: Object) {
    const id = uniqueId();

    return new Promise<WorkerCallbackSignature>((resolve) => {
      this.callbacks[id] = resolve;
      this.pyodideWorker.postMessage({
        ...context,
        python,
        id,
      });
    });
  }

  async asyncParseMessage(message: Message): Promise<Term[]> {
    const { results, error } = await this.postMessage(
      this.tokenizing_script(message)
    );

    error && console.error(error);

    return results as string[];
  }
}
