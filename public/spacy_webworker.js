// webworker.js

// Setup your project to serve `py-worker.js`. You should also serve
// `pyodide.js`, and all its associated `.asm.js`, `.data`, `.json`,
// and `.wasm` files as well:
importScripts("https://cdn.jsdelivr.net/pyodide/v0.22.1/full/pyodide.js");

async function loadPyodideAndPackages() {
  self.pyodide = await loadPyodide();
  await self.pyodide.loadPackage(["numpy", "pytz"]);
  await self.pyodide.loadPackagesFromImports(`import micropip`);
  await self.pyodide.runPythonAsync(`
    import micropip
    await micropip.install('./blis-0.7.9-cp310-cp310-emscripten_3_1_27_wasm32.whl')
    await micropip.install('./cymem-2.0.7-cp310-cp310-emscripten_3_1_27_wasm32.whl')
    await micropip.install('./murmurhash-1.0.9-cp310-cp310-emscripten_3_1_27_wasm32.whl')
    await micropip.install('./preshed-3.0.8-cp310-cp310-emscripten_3_1_27_wasm32.whl')
    await micropip.install('./srsly-2.4.5-cp310-cp310-emscripten_3_1_27_wasm32.whl')
    await micropip.install('./thinc-8.1.7-cp310-cp310-emscripten_3_1_27_wasm32.whl')
    await micropip.install('./spacy-3.5.0-cp310-cp310-emscripten_3_1_27_wasm32.whl', keep_going=True)
    await micropip.install('./en_core_web_sm-3.5.0-py3-none-any.whl')
    import spacy

    nlp = spacy.load("en_core_web_sm")

    from pyodide.ffi import to_js
    def tokenize(sentence):
      doc = nlp(sentence)
      token = [{"text": token.text, "lemma": token.lemma_, "pos": token.pos_,
              "tag": token.tag_, "dep": token.dep_, "shape": token.shape_,
              "alpha": token.is_alpha, "stop": token.is_stop} for token in doc]
      return to_js({ "token": token})
  `);
}
let pyodideReadyPromise = loadPyodideAndPackages();

self.onmessage = async (event) => {
  // make sure loading is done
  await pyodideReadyPromise;
  // Don't bother yet with this line, suppose our API is built in such a way:
  const { id, python, ...context } = event.data;
  // The worker copies the context in its own "memory" (an object mapping name to values)
  for (const key of Object.keys(context)) {
    self[key] = context[key];
  }

  try {
    let results = await self.pyodide.runPythonAsync(python);
    self.postMessage({ results, id });
  } catch (error) {
    self.postMessage({ error: error.message, id });
  }
};
