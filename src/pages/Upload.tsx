import { FormEventHandler, useState } from "react";
import {
  local_datasource,
  MSNFormatter,
  MessengerFormatter,
  whitespace_tokenizer,
  spacy_tokenizer,
  async_datasource,
} from "../config";

export const Upload = () => {
  type TokenizerConfig = {
    data_key: "whitespace" | "spacy";
    label: string;
    tooltip: string;
  };
  const [tokenizer, set_tokenizer] =
    useState<TokenizerConfig["data_key"]>("whitespace");
  const tokenizers: TokenizerConfig[] = [
    {
      data_key: "whitespace",
      label: "Whitespace",
      tooltip: "Uses a simple whitespace-based tokenizer.",
    },
    {
      data_key: "spacy",
      label: "spaCy",
      tooltip: "Uses spaCy's pre-built NLP model to tokenizer messages.",
    },
  ];

  const tokenizer_instance = () => {
    switch (tokenizer) {
      case "whitespace":
        return whitespace_tokenizer;
      case "spacy":
        return spacy_tokenizer;
    }
  };

  const [loading, set_loading] = useState(false);

  const handleMSNXML = (files: FileList | null) => {
    if (!files) return;
    set_loading(true);
    Array.from(files).forEach((file) => {
      const fr = new FileReader();
      fr.onload = (e) => {
        const { metadata, messages } = MSNFormatter.formatChatLog(
          (e?.target?.result as string)?.trim()
        );
        const recipient = metadata.participants[1].identifier;
        messages.forEach((chat_line) => {
          const [line_number, timestamp, message, source, source_metadata] =
            chat_line;
          const terms = tokenizer_instance().parseMessage(message);
          const inserted_index = local_datasource.addToStorage(
            recipient,
            line_number,
            timestamp,
            message,
            source,
            source_metadata
          );
          local_datasource.addToIndex(
            { recipient, inserted_index, timestamp },
            terms
          );
        });
        set_loading(false);
      };
      fr.readAsText(file);
    });
  };

  const handleChange: FormEventHandler<HTMLInputElement> = (e) =>
    handleMSNXML(e.currentTarget.files);

  const handleMessengerJSON = (files: FileList | null) => {
    if (!files) return;
    set_loading(true);
    Array.from(files).forEach((file) => {
      const fr = new FileReader();
      fr.onload = (e) => {
        const { metadata, messages } = MessengerFormatter.formatChatLog(
          (e?.target?.result as string)?.trim()
        );

        async_datasource.bulkAddToStorage(
          metadata.participants[0].identifier,
          messages,
          tokenizer_instance().parseMessage
        );
        set_loading(false);
      };
      fr.readAsText(file);
    });
  };

  const handleMessengerUpload: FormEventHandler<HTMLInputElement> = (e) =>
    handleMessengerJSON(e.currentTarget.files);

  const Button = ({ data_key, label, tooltip }: TokenizerConfig) => (
    <button
      className={`btn ${tokenizer === data_key ? "btn-active" : ""} ${
        loading ? "btn-disabled" : ""
      } tooltip`}
      onClick={() => set_tokenizer(data_key)}
      data-tip={tooltip}
    >
      {label}
    </button>
  );

  return (
    <>
      <h1>This is the chat upload page</h1>

      <div className="flex flex-col w-full border-opacity-50">
        <div className="divider">File format to upload</div>
      </div>

      <label>
        <span className="label">MSN XML</span>
        <input
          type="file"
          multiple
          onChange={handleChange}
          className="file-input"
        />
      </label>

      <label>
        <span className="label">Messenger JSON</span>
        <input
          type="file"
          multiple
          onChange={handleMessengerUpload}
          className="file-input"
        />
      </label>

      <div className="flex flex-col w-full border-opacity-50">
        <div className="divider">Settings</div>
      </div>

      <label className="label">Tokenizer to use</label>
      <div className="btn-group">
        {tokenizers.map((tokenizer) => (
          <Button key={tokenizer.data_key} {...tokenizer} />
        ))}
      </div>
    </>
  );
};
