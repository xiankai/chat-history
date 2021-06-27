import {
  ChatLog,
  ChatLogFormat,
  ChatLogMetadata,
  LineNumber,
} from '@/datasources/base';
import BaseFormatter from './base';

class ParsingError extends Error {}

export default class MSNFormatter extends BaseFormatter {
  source() {
    return 'MSN';
  }

  parse_session_line() {
    // | Session Start: Thursday, November 06, 2008                         |
    return /Session Start: (.*), (.*) (\d*), (\d*)/;
  }

  parse_participant_line() {
    // |    <insert random word here> you (nonamethinkable@hotmail.com)     |
    // |    na∂av (duvly@hotmail.com)                                       |
    return /\s+(.*?)(?: you)? \((.*)\)/;
  }

  parse_message_line() {
    // [5:53:59 PM] na∂av: do u have deans msn?
    return /\[(\d{1,2}):(\d{2}):(\d{2}) ([A|P]M)] (.*): (.*)/;
  }

  formatHeaders(lines: string[]): ChatLogMetadata {
    const [session_start, _, ...participants_string] = lines;

    const session_result = session_start.match(this.parse_session_line());
    if (!session_result) {
      throw new Error(`
        unable to parse line:
        ${session_start}
        using regex:
        ${this.parse_session_line.toString()}
      `);
    }
    const [__, day, month, date, year] = session_result!;

    const participants = participants_string.map((participant) => {
      const participant_result = participant.match(
        this.parse_participant_line()
      );
      if (!participant_result) {
        throw new Error(`
        unable to parse line:
        ${participant}
        using regex:
        ${this.parse_participant_line.toString()}
      `);
      }
      const [_, display_name, identifier] = participant_result!;
      return {
        display_name,
        identifier,
      };
    });

    const date_obj = new Date(
      `${day.slice(0, 3)}, ${date} ${month.slice(0, 3)} ${year}`
    );

    return {
      date: date_obj,
      participants,
    };
  }

  formatMessage(
    line_number: LineNumber,
    line: string,
    metadata: any
  ): ChatLogFormat {
    const result = line.match(this.parse_message_line());
    if (!result) {
      throw new ParsingError(`
        unable to parse line ${line_number}:
        ${line}
        using regex:
        ${this.parse_message_line.toString()}
      `);
    }
    const [_, hour, minute, second, meridian, sender, message] = result!;
    const timestamp = new Date(metadata.date);
    timestamp.setHours(+hour + (meridian === 'PM' ? 12 : 0));
    timestamp.setMinutes(+minute);
    timestamp.setSeconds(+second);
    return [
      line_number,
      timestamp,
      message as string,
      this.source(),
      { sender },
    ];
  }

  formatChatLog(input: string): ChatLog {
    const sessions = input.split('\n\n\n');

    let line_counter = 0;
    let metadata: ChatLogMetadata | undefined;
    const messages: ChatLogFormat[] = [];
    sessions.forEach((session) => {
      line_counter += 6; // headers
      const lines = session.split('\n');
      if (!metadata) {
        metadata = this.formatHeaders(lines.slice(1, 5));
      } else {
        line_counter += 3; // spacing between sessions
      }

      let chat_log: ChatLogFormat | undefined;
      lines.slice(6).forEach((line) => {
        line_counter++;
        try {
          const temp_chat_log = this.formatMessage(
            line_counter,
            line,
            metadata
          );

          // new entry, so we push the old entry and start a new one
          if (chat_log) {
            messages.push(chat_log);
          }
          chat_log = temp_chat_log;
        } catch (e) {
          // old entry, so we add to it
          if (e instanceof ParsingError) {
            chat_log![2] += ' ' + line.slice(13);
          } else {
            throw e;
          }
        }
      });
      // push the last chat message
      if (chat_log) {
        messages.push(chat_log);
      }
    });

    return {
      metadata: metadata!,
      messages,
    };
  }
}
