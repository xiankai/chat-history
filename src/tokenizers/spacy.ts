import { Message, Term } from "datasources/base";
import { loadPyodide } from "pyodide";
import BaseTokenizer from "./base";

export default class SpacyTokenizer extends BaseTokenizer {
  constructor() {
    super();

    const loadWorker = async () => {
      const pyodideWorker = new Worker("./webworker.js", { type: "classic" });

      const callbacks: { [id: number]: any } = {};

      pyodideWorker.onmessage = (event) => {
        const { id, ...data } = event.data;
        const onSuccess = callbacks[id];
        delete callbacks[id];
        onSuccess(data);
      };

      const asyncRun = (() => {
        let id = 0; // identify a Promise
        return (script: string, context: object) => {
          // the id could be generated more carefully
          id = (id + 1) % Number.MAX_SAFE_INTEGER;
          return new Promise<any>((onSuccess: any) => {
            callbacks[id] = onSuccess;
            pyodideWorker.postMessage({
              ...context,
              python: script,
              id,
            });
          });
        };
      })();

      const script = `
        # import statistics
        # from js import A_rank
        # statistics.stdev(A_rank)
        import micropip
        # await micropip.install('./blis-0.7.9-cp310-cp310-emscripten_3_1_27_wasm32.whl')
        # await micropip.install('./cymem-2.0.7-cp310-cp310-emscripten_3_1_27_wasm32.whl')
        # await micropip.install('./murmurhash-1.0.9-cp310-cp310-emscripten_3_1_27_wasm32.whl')
        # await micropip.install('./preshed-3.0.8-cp310-cp310-emscripten_3_1_27_wasm32.whl')
        # await micropip.install('./srsly-2.4.5-cp310-cp310-emscripten_3_1_27_wasm32.whl')
        # await micropip.install('./thinc-8.1.7-cp310-cp310-emscripten_3_1_27_wasm32.whl')
        await micropip.install('./spacy-3.5.0-cp310-cp310-emscripten_3_1_27_wasm32.whl', keep_going=True)
        # await micropip.install('./en_core_web_sm-3.5.0-py3-none-any.whl')
        import spacy

        nlp = spacy.load("en_core_web_sm")

        from js import sentence
        from pyodide import to_js
        def tokenize(sentence):
          doc = nlp(sentence)
          token = [{"text": token.text, "lemma": token.lemma_, "pos": token.pos_,
                  "tag": token.tag_, "dep": token.dep_, "shape": token.shape_,
                  "alpha": token.is_alpha, "stop": token.is_stop} for token in doc]
          return to_js({ "token": token})
        tokenize(sentence)
      `;

      const context = {
        A_rank: [0.8, 0.4, 1.2, 3.7, 2.6, 5.8],
        sentence: "The rains in Spain fall mainly in the plains.",
      };

      async function main() {
        try {
          const { results, error } = await asyncRun(script, context);
          if (results) {
            console.log("pyodideWorker return results: ", results);
          } else if (error) {
            console.log("pyodideWorker error: ", error);
          }
        } catch (e: any) {
          console.log(
            `Error in pyodideWorker at ${e.filename}, Line: ${e.lineno}, ${e.message}`
          );
        }
      }

      main();
    };

    loadWorker();
  }

  parseMessage(message: Message): Term[] {
    return message.split(" ");
  }
}
