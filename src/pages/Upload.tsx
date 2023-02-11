import { FormEventHandler } from "react";
import { datasource, formatter, tokenizer } from "../config";

export const Upload = () => {
  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      const fr = new FileReader();
      fr.onload = (e) => {
        const { metadata, messages } = formatter.formatChatLog(
          (e?.target?.result as string)?.trim()
        );
        const recipient = metadata.participants[1].identifier;
        messages.forEach((chat_line) => {
          const [line_number, timestamp, message, source, source_metadata] =
            chat_line;
          const terms = tokenizer.parseMessage(message);
          const inserted_index = datasource.addToStorage(
            recipient,
            line_number,
            timestamp,
            message,
            source,
            source_metadata
          );
          datasource.addToIndex(
            { recipient, inserted_index, timestamp },
            terms
          );
        });
      };
      fr.readAsText(file);
    });
  };

  const handleChange: FormEventHandler<HTMLInputElement> = (e) =>
    handleFiles(e.currentTarget.files);

  return (
    <>
      <div>This is the chat upload page</div>
      <input type="file" multiple onChange={handleChange} />
    </>
  );
};
