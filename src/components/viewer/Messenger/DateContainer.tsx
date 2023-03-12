import {
  ChatLogFormat,
  ChatLogFormatMessage,
  ChatLogFormatSourceMetadata,
} from "datasources/base";
import { MessengerMetadata } from "formatter/messenger";
import { MessageContainer } from "./MessageContainer";
import { PhotoMessage } from "./PhotoMessage";
import { TextMessage } from "./TextMessage";
import { VideoMessage } from "./VideoMessage";
import { spacy_tokenizer } from "../../../config";

export const DateContainer = ({
  date,
  children,
}: {
  date: Date;
  children: React.ReactNode;
}) => {
  return (
    <div className="">
      <div className="divider">{date.toLocaleString()}</div>
      {children}
    </div>
  );
};
