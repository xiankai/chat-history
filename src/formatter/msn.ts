import { ChatLogFormat, LineNumber, Message, Term } from "@/datasources/base";
import BaseFormatter from './base';
import { sscanf } from 'scanf';

export default class MSNFormatter extends BaseFormatter {
    source() {
        return 'MSN';
    }

    format() {
        // [5:53:59 PM] na∂av: do u have deans msn?
        return /\[(\d{1,2}):(\d{2}):(\d{2}) ([A|P]M)] (.*): (.*)/;
    }

    offset() {
        return 6;
    }

    formatMessage(line_number: LineNumber, line: string): ChatLogFormat {
        const result = line.match(this.format());
        const [match, hour, minute, second, meridian, sender, message] = result!;
        const timestamp = new Date();
        timestamp.setHours(+hour + (meridian === 'PM' ? 12 : 0));
        timestamp.setMinutes(+minute);
        timestamp.setSeconds(+second);
        return [line_number, timestamp, message as string, this.source(), { sender }];
    }
}