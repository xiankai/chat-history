import {
  ChatLogFormat,
  ChatLogFormatMessage,
  ChatLogFormatSourceMetadata,
} from "datasources/base";
import { MessengerMetadata } from "formatter/messenger";
import { useEffect } from "react";
import { MessageContainer } from "./MessageContainer";
import { PhotoMessage } from "./PhotoMessage";
import { TextMessage } from "./TextMessage";
import { VideoMessage } from "./VideoMessage";
import { spacy_tokenizer } from "../../../config";

export const Messenger = ({
  logs,
  recipient,
  date,
}: {
  recipient: string;
  date: string;
  logs: ChatLogFormat[];
}) => {
  useEffect(() => {
    logs.map((log) =>
      spacy_tokenizer
        .asyncParseMessage(log[ChatLogFormatMessage])
        .then(console.log)
    );
  }, [logs]);

  const assetPrefixUrl = "/samples/facebook-johnathon52/";
  return (
    <div className="flex flex-col">
      {logs.map((log) => {
        const { sender_name, photos, reactions, videos } = log[
          ChatLogFormatSourceMetadata
        ] as MessengerMetadata;
        const message = log[ChatLogFormatMessage];
        const isRecipient = sender_name === recipient;
        const content =
          (message && (
            <TextMessage isRecipient={isRecipient} message={message} />
          )) ||
          (photos && (
            <PhotoMessage photos={photos} assetPrefixUrl={assetPrefixUrl} />
          )) ||
          (videos && (
            <VideoMessage videos={videos} assetPrefixUrl={assetPrefixUrl} />
          ));
        return (
          <MessageContainer
            isRecipient={isRecipient}
            content={content}
            reactions={reactions}
          />
        );
      })}
    </div>
  );
};
