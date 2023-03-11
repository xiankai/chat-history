import { MessengerMetadata } from "formatter/messenger"
import { ReactNode } from "react"
import { fixMessengerExport } from "utils/string"

export const MessageContainer = ({
  isRecipient,
  content,
  reactions,
}: {
  isRecipient: boolean,
  content: ReactNode,
  reactions: MessengerMetadata['reactions']
}) => {
  return <div className={`
    ${isRecipient ? "self-start" : "self-end"}
    max-w-3/5
    mt-1 mb-1 ml-7 mr-5
  `}>
    <div>
      {content}
    </div>
    {reactions?.length && <div className={`
      ${isRecipient ? "text-left" : "text-right"}
      -mt-3 h-3
    `}>{
      reactions?.map(reaction => (
        <span className="">{fixMessengerExport(reaction.reaction)}</span>
      ))
    }</div>}
  </div>
}