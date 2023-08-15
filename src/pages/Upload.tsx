import { createRef, FormEventHandler, useState } from "react";
import ConfigStore from "stores/config_store";
import { ProgressBar, ProgressBarProps } from "components/ProgressBar";
import { SupportedFormatter } from "formatter/base";

export const Upload = () => {
  const [loading, set_loading] = useState(false);
  const [progress_bars, set_progress_bars] = useState<ProgressBarProps[]>([]);

  const MSNXMLRef = createRef<HTMLInputElement>();
  const handleMSNXML = (files: FileList | null) => {
    if (!files) return;
    handle_start();
    Array.from(files).forEach((file) => {
      const fr = new FileReader();
      fr.onload = (e) => {
        const { metadata, messages } = ConfigStore.msn_formatter.formatChatLog(
          (e?.target?.result as string)?.trim()
        );
        const recipient = metadata.participants[1].identifier;

        const progress_tracker_callback =
          ConfigStore.datasource_instance.bulkAddToStorage(
            recipient,
            SupportedFormatter.MSN,
            messages,
            ConfigStore.tokenizer_instance.asyncParseMessage.bind(
              ConfigStore.tokenizer_instance
            )
          );

        set_progress_bars((progress_bars) => [
          ...progress_bars,
          {
            index: file.name,
            text_template: `Processed {current} out of {total} records for ${file.name}`,
            progress_tracker_callback,
            total_progress: messages.length,
          },
        ]);
      };
      fr.readAsText(file);
    });
  };

  const handleChange: FormEventHandler<HTMLInputElement> = (e) =>
    handleMSNXML(e.currentTarget.files);

  const handle_start = () => {
    set_progress_bars([]);
    set_loading(true);
  };

  const handle_end = () => {
    set_loading(false);
  };

  const MessengerJSONRef = createRef<HTMLInputElement>();
  const handleMessengerJSON = (files: FileList | null) => {
    if (!files) return;
    handle_start();
    Array.from(files).forEach((file) => {
      const fr = new FileReader();
      fr.onload = async (e) => {
        const { metadata, messages } =
          ConfigStore.messenger_formatter.formatChatLog(
            (e?.target?.result as string)?.trim()
          );

        const progress_tracker_callback =
          ConfigStore.datasource_instance.bulkAddToStorage(
            metadata.participants[0].identifier,
            SupportedFormatter.Messenger,
            messages,
            ConfigStore.tokenizer_instance.asyncParseMessage.bind(
              ConfigStore.tokenizer_instance
            )
          );

        set_progress_bars((progress_bars) => [
          ...progress_bars,
          {
            index: file.name,
            text_template: `Processed {current} out of {total} records for ${file.name}`,
            progress_tracker_callback,
            total_progress: messages.length,
          },
        ]);

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

      <div className="flex flex-col w-full border-opacity-50">
        <div className="divider"></div>
      </div>

      <button className="btn btn-primary" onClick={handleUpload}>
        Start
      </button>

      {progress_bars.map((progress_bar) => (
        <ProgressBar key={progress_bar.index} {...progress_bar} />
      ))}
    </>
  );
};
