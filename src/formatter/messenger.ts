import { ChatLog } from "datasources/base";
import BaseFormatter, { SupportedFormatter } from "./base";

export default class MessengerFormatter extends BaseFormatter {
  source() {
    return SupportedFormatter.Messenger;
  }

  formatChatLog(input: string): ChatLog {
    const { participants, messages } = JSON.parse(input) as MessengerChatFormat;

    return {
      metadata: {
        participants: participants.map((participant) => ({
          identifier: participant.name,
          display_name: participant.name,
        })),
        date: new Date(),
      },
      messages: messages.map((message, index) => [
        index,
        new Date(message.timestamp_ms),
        message.content || "",
        this.source(),
        {
          sender_name: message.sender_name,
          photos: message.photos,
          reactions: message.reactions,
          videos: message.videos,
        },
      ]),
    };
  }
}

export type MessengerChatFormat = {
  participants: Participant[];
  messages: Message[];
  title: string;
  is_still_participant: boolean;
  thread_path: string;
  magic_words: unknown[];
};

type Participant = {
  name: string;
};

type Message = {
  sender_name: string;
  timestamp_ms: number;
  content?: string;
  videos?: {
    uri: string;
    creation_timestamp: number;
  }[];
  photos?: {
    uri: string;
    creation_timestamp: number;
  }[];
  reactions?: {
    reaction: string;
    actor: string;
  }[];
};

export type MessengerMetadata = Message;
