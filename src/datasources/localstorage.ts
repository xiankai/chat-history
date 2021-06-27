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

export default class LocalStorageDatasource extends BaseDatasource {
  private getStorageItem = (key: string, default_value = {}) => {
    return (
      JSON.parse(window.localStorage.getItem(key) || '{}') || default_value
    );
  };
  private setStorageItem = (key: string, value: any) => {
    return window.localStorage.setItem(key, JSON.stringify(value));
  };

  addToIndex(index: Index, terms: Term[]) {
    const { line_number, recipient, timestamp } = index;
    const stored_terms = this.getStorageItem('terms');
    const date = parseTimestampIntoDateBucket(timestamp);
    for (const i in terms) {
      const term = terms[i];
      if (stored_terms[term]) {
        stored_terms[term].push([recipient, date, line_number]);
      } else {
        stored_terms[term] = [[recipient, date, line_number]];
      }
    }

    this.setStorageItem('terms', stored_terms);
  }

  addToStorage(
    recipient: Recipient,
    line_number: LineNumber,
    timestamp: Timestamp,
    message: Message,
    source: Source,
    source_metadata: SourceMetadata
  ) {
    const stored_logs = this.getStorageItem('logs');
    const { year, month, day } = parseTimestampIntoDateBucket(timestamp);
    const chat_log: ChatLogFormat = [
      line_number,
      timestamp,
      message,
      source,
      source_metadata,
    ];
    push_safe(stored_logs, [recipient, year, month, day], chat_log);
    this.setStorageItem('logs', stored_logs);
  }

  retrieveBucketFromStorage(
    recipient: Recipient,
    date: DateBucketReference
  ): ChatLogFormat[] {
    const stored_logs = this.getStorageItem('logs');
    const { year, month, day } = date;
    const date_bucket = get(stored_logs, [recipient, year, month, day], []);
    return date_bucket;
  }

  retrieveMessageFromStorage(
    recipient: Recipient,
    date: DateBucketReference,
    message_index: number
  ): ChatLogFormat {
    const stored_logs = this.getStorageItem('logs');

    const { year, month, day } = date;
    return get(stored_logs, [recipient, year, month, day, message_index]);
  }

  searchStorage(query: SearchQuery): SearchResult[] {
    const stored_indices = this.getStorageItem('terms');
    return stored_indices[query];
  }
}
