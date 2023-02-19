import { FormEventHandler } from "react";
import {
  local_datasource,
  MSNFormatter,
  MessengerFormatter,
  whitespace_tokenizer,
  async_datasource,
} from "../config";

export const Upload = () => {
  const handleMSNXML = (files: FileList | null) => {
    if (!files) return;
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
          const terms = whitespace_tokenizer.parseMessage(message);
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

  const handleMessengerJSON = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      const fr = new FileReader();
      fr.onload = (e) => {
        const { metadata, messages } = MessengerFormatter.formatChatLog(
          (e?.target?.result as string)?.trim()
        );

        async_datasource.bulkAddToStorage(
          metadata.participants[0].identifier,
          messages,
          whitespace_tokenizer.parseMessage
        );
      };
      fr.readAsText(file);
    });
  };

  const handleMessengerUpload: FormEventHandler<HTMLInputElement> = (e) =>
    handleMessengerJSON(e.currentTarget.files);

  return (
    <>
      <div>This is the chat upload page</div>
      <label>
        <span>MSN XML</span>
        <input type="file" multiple onChange={handleChange} />
      </label>

      <label>
        <span>Messenger JSON</span>
        <input type="file" multiple onChange={handleMessengerUpload} />
      </label>
    </>
  );
};
