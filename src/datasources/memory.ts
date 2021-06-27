import get from 'lodash/get';
import { parseTimestampIntoDateBucket } from '../utils/date';
import BaseDatasource, {
  Term,
  DateBucketReference,
  LineNumber,
  ChatLogFormat,
  Timestamp,
  Message,
  Source,
  SourceMetadata,
  SearchQuery,
  Index,
  SearchResult,
  Recipient,
} from './base';
import { push_safe } from '@/utils';

interface MemoryDatasourceIndex {
  [term: string]: SearchResult[];
}

interface DateBuckets {
  [recipient: string]: {
    [year: number]: {
      [month: number]: {
        [day: number]: ChatLogFormat[];
      };
    };
  };
}

interface MemoryDatasourceStorage {
  index: MemoryDatasourceIndex;
  logs: DateBuckets;
}

export default class MemoryDatasource extends BaseDatasource {
  store: MemoryDatasourceStorage = {
    index: {},
    logs: {},
  };

  addToIndex(index: Index, terms: Term[]) {
    const { line_number, recipient, timestamp } = index;
    const date = parseTimestampIntoDateBucket(timestamp);
    for (const i in terms) {
      const term = terms[i];
      if (this.store.index[term]) {
        this.store.index[term].push([recipient, date, line_number]);
      } else {
        this.store.index[term] = [[recipient, date, line_number]];
      }
    }
  }

  addToStorage(
    recipient: Recipient,
    line_number: LineNumber,
    timestamp: Timestamp,
    message: Message,
    source: Source,
    source_metadata: SourceMetadata
  ) {
    const { year, month, day } = parseTimestampIntoDateBucket(timestamp);
    const chat_log: ChatLogFormat = [
      line_number,
      timestamp,
      message,
      source,
      source_metadata,
    ];
    push_safe(this.store.logs, [recipient, year, month, day], chat_log);
  }

  retrieveBucketFromStorage(
    recipient: Recipient,
    date: DateBucketReference
  ): ChatLogFormat[] {
    const { year, month, day } = date;
    const date_bucket = get(this.store.logs, [recipient, year, month, day], []);
    return date_bucket;
  }

  retrieveMessageFromStorage(
    recipient: Recipient,
    date: DateBucketReference,
    message_index: number
  ): ChatLogFormat {
    const { year, month, day } = date;
    const message = get(this.store.logs, [
      recipient,
      year,
      month,
      day,
      message_index,
    ]);
    return message;
  }

  searchStorage(query: SearchQuery): SearchResult[] {
    return this.store.index[query];
  }
}
