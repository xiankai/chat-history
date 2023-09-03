# What

An app for you to make chat history from various applications, searchable.

# Why

To have control over your data, provided as long as you are able to export it.

# How

1. Providing the chat log files

   Currently, 2 chat log file formats are supported - facebook log dump, or MSN `.txt` files (not MSN `.xml` files)

   You are able to provide them by uploading them directly (`Upload` tab) or pointing to the location of the root folder containing these files (`Filesystem`)

2. Indexing and making chat history searchable

   4 options have been explored thus far:

   - Whitespace (words will be matched directly)
   - spaCy (using their `en_web_core_sm` model, loaded directly in the browser via pyodide/webasm)
   - ~~OpenAI's API (via `langchain`)~~ (abandoned)
   - Vector (using the sentence transformer model `sentence-transformers/paraphrase-MiniLM-L3-v2`, loaded via a backend API)

3. Where data will be stored

   4 options have been explored thus far:

   - In-memory storage (no persistence, only for the browser session)
   - Browser `localStorage` API
   - Browser `IndexedDB` API (via `idb-keyval`)
   - ~~In-memory vector database (via `langchain` and `chroma`)~~
   - Backend (via `txtai`, hosted with `ModalLabs`)

4. How data is secured

   The auth implementation is provided by `firebase`/`firebase-ui`.

   You have to sign in with an identity provider (currently Google is only provided), and then data provided is tied to that identity.

   - Facebook requires a business process for approval, so scrapping that for now.

5. How chat history is presented (`Viewer` tab)

   I tried to recreate the chat interface from Facebook Messenger, including reactions, images and videos.

6. Search interface (`Search` tab)

   HTML5 Datepicker for simplicity
