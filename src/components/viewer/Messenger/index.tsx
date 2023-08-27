import {
  ChatLogFormat,
  ChatLogFormatLineNumber,
  ChatLogFormatMessage,
  ChatLogFormatSender,
  ChatLogFormatSourceMetadata,
  ChatLogFormatTimestamp,
} from "datasources/base";
import { MessengerMetadata } from "formatter/messenger";
import { MessageContainer } from "./MessageContainer";
import { PhotoMessage } from "./PhotoMessage";
import { TextMessage } from "./TextMessage";
import { VideoMessage } from "./VideoMessage";

export const Messenger = ({
  logs,
  recipient,
}: {
  recipient: string;
  logs: ChatLogFormat[];
}) => {
  const assetPrefixUrl = "/samples/facebook-johnathon52/";
  return (
    <div className="flex flex-col">
      {logs.map((log, i) => {
        const { photos, reactions, videos } = log[
          ChatLogFormatSourceMetadata
        ] as MessengerMetadata;
        const message = log[ChatLogFormatMessage];
        const isRecipient = log[ChatLogFormatSender] === recipient;
        const content =
          (message && (
            <TextMessage isRecipient={isRecipient} message={message} />
          )) ||
          (photos && (
            <PhotoMessage
              isRecipient={isRecipient}
              photos={photos}
              assetPrefixUrl={assetPrefixUrl}
            />
          )) ||
          (videos && (
            <VideoMessage
              isRecipient={isRecipient}
              videos={videos}
              assetPrefixUrl={assetPrefixUrl}
            />
          ));
        return (
          <MessageContainer
            key={i}
            line={log[ChatLogFormatLineNumber]}
            date={new Date(log[ChatLogFormatTimestamp])}
            isRecipient={isRecipient}
            content={content}
            reactions={reactions}
          />
        );
      })}
    </div>
  );
};
