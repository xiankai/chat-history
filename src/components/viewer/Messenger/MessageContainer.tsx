import { MessengerMetadata } from "formatter/messenger";
import { ReactNode } from "react";
import { fixMessengerExport } from "utils/string";

export const MessageContainer = ({
  line,
  isRecipient,
  content,
  reactions,
  date,
}: {
  line: number;
  isRecipient: boolean;
  content: ReactNode;
  reactions: MessengerMetadata["reactions"];
  date: Date;
}) => {
  return (
    <div
      className={`
        ${isRecipient ? "self-start" : "self-end"}
        max-w-3/5
        mt-1 mb-1 ml-7 mr-5
      `}
      data-line-number={line}
    >
      <div className="tooltip tooltip-left" data-tip={date.toLocaleString()}>
        {content}
      </div>
      {reactions?.length && (
        <div className={"flex flex-row-reverse -mt-3 h-3"}>
          <div className="w-5 h-5 rounded-full bg-white z-10 flex justify-center">
            {reactions?.map((reaction) => (
              <span>{fixMessengerExport(reaction.reaction)}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
