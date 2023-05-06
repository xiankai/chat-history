import { createRef, FormEventHandler, Fragment, useState } from "react";
import { formatDurationFromSeconds } from "utils/string";
import {
  local_datasource,
  MSNFormatter,
  MessengerFormatter,
  whitespace_tokenizer,
  spacy_tokenizer,
  vector_tokenizer,
  async_datasource,
} from "../config";

export const Upload = () => {
  type TokenizerConfig = {
    data_key: "whitespace" | "spacy" | "vector";
    label: string;
    tooltip: string;
  };
  const [tokenizer, set_tokenizer] =
    useState<TokenizerConfig["data_key"]>("spacy");
  const tokenizers: TokenizerConfig[] = [
    {
      data_key: "whitespace",
      label: "Whitespace",
      tooltip: "Uses a simple whitespace-based tokenizer.",
    },
    {
      data_key: "spacy",
      label: "spaCy",
      tooltip: "Uses spaCy's pre-built NLP model to tokenize messages.",
    },
    {
      data_key: "vector",
      label: "vector",
      tooltip:
        "Uses vector representations of text embeddings built from sentence transformers",
    },
  ];

  const tokenizer_instance = () => {
    switch (tokenizer) {
      case "vector":
        return vector_tokenizer;
      case "whitespace":
        return whitespace_tokenizer;
      case "spacy":
        return spacy_tokenizer;
    }
  };

  const [loading, set_loading] = useState(false);
  const [duration, set_duration] = useState(0);
  const [duration_tracker, set_duration_tracker] = useState<number>();

  type ProgressBar = {
    file_name: string;
    progress: number;
    progress_goal: number;
  };
  const [progress_bars, set_progress_bars] = useState<ProgressBar[]>([]);

  const MSNXMLRef = createRef<HTMLInputElement>();
  const handleMSNXML = (files: FileList | null) => {
    if (!files) return;
    handle_start();
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
      };
      fr.readAsText(file);
    });
  };

  const handleChange: FormEventHandler<HTMLInputElement> = (e) =>
    handleMSNXML(e.currentTarget.files);

  const handle_start = () => {
    set_progress_bars([]);
    set_duration(0);
    set_loading(true);
    set_duration_tracker(
      window.setInterval(() => set_duration((duration) => duration + 1), 1000)
    );
  };

  const handle_end = () => {
    set_loading(false);
    clearInterval(duration_tracker);
  };

  const MessengerJSONRef = createRef<HTMLInputElement>();
  const handleMessengerJSON = (files: FileList | null) => {
    if (!files) return;
    handle_start();
    Array.from(files).forEach((file, file_index) => {
      const fr = new FileReader();
      fr.onload = async (e) => {
        const { metadata, messages } = MessengerFormatter.formatChatLog(
          (e?.target?.result as string)?.trim()
        );

        set_progress_bars((progress_bars) => [
          ...progress_bars,
          {
            file_index,
            file_name: file.name,
            progress: 0,
            progress_goal: messages.length,
          },
        ]);

        await async_datasource.bulkAddToStorage(
          metadata.participants[0].identifier,
          messages,
          tokenizer_instance().asyncParseMessage.bind(tokenizer_instance()),
          (callback) => {
            let progress_interval_id = setInterval(() => {
              let progress = callback();
              set_progress_bars((progress_bars) => {
                const new_progress_bars = progress_bars.slice();
                new_progress_bars[file_index].progress = progress;
                return new_progress_bars;
              });
              if (progress >= messages.length) {
                clearInterval(progress_interval_id);
              }
            }, 1000);
          }
        );

        handle_end();
      };
      fr.readAsText(file);
    });
  };

  const handleMessengerUpload: FormEventHandler<HTMLInputElement> = (e) =>
    handleMessengerJSON(e.currentTarget.files);

  const handleUpload = () => {
    if (MessengerJSONRef.current?.files?.length) {
      handleMessengerJSON(MessengerJSONRef.current.files);
    }

    if (MSNXMLRef.current?.files?.length) {
      handleMessengerJSON(MSNXMLRef.current.files);
    }
  };

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
        <input type="file" multiple className="file-input" ref={MSNXMLRef} />
      </label>

      <label>
        <span className="label">Messenger JSON</span>
        <input
          type="file"
          multiple
          className="file-input"
          ref={MessengerJSONRef}
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

      <div className="flex flex-col w-full border-opacity-50">
        <div className="divider"></div>
      </div>

      <button className="btn btn-primary" onClick={handleUpload}>
        Start
      </button>

      <span className="label">
        Time elapsed {formatDurationFromSeconds(duration)}
      </span>
      {progress_bars.map((progress_bar, index) => (
        <Fragment key={index}>
          <span className="label">
            Processed {progress_bar.progress.toLocaleString()} out of{" "}
            {progress_bar.progress_goal.toLocaleString()} records for{" "}
            {progress_bar.file_name}
          </span>
          <progress
            value={progress_bar.progress}
            max={progress_bar.progress_goal}
          ></progress>
        </Fragment>
      ))}
    </>
  );
};
