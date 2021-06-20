import has from 'lodash/has';
import get from 'lodash/get';
import set from 'lodash/set';
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
} from './base';

type SearchResult = [DateBucketReference, LineNumber];

export default class LocalStorageDatasource extends BaseDatasource {
  private getStorageItem = (key: string, default_value = {}) => {
    return (
      JSON.parse(window.localStorage.getItem(key) || '{}') || default_value
    );
  };
  private setStorageItem = (key: string, value: any) => {
    return window.localStorage.setItem(key, JSON.stringify(value));
  };

  addToIndex(line_number: LineNumber, timestamp: Timestamp, terms: Term[]) {
    const stored_terms = this.getStorageItem('terms');
    const date = parseTimestampIntoDateBucket(timestamp);
    for (const i in terms) {
      const term = terms[i];
      if (stored_terms[term]) {
        stored_terms[term].push([date, line_number]);
      } else {
        stored_terms[term] = [[date, line_number]];
      }
    }

    this.setStorageItem('terms', stored_terms);
  }

  addToStorage(
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
    if (has(stored_logs, [year, month, day])) {
      stored_logs[year][month][day].push(chat_log);
    } else {
      set(stored_logs, [year, month, day].map(String), [chat_log]);
    }
    this.setStorageItem('logs', stored_logs);
  }

  retrieveBucketFromStorage(date: DateBucketReference): ChatLogFormat[] {
    const stored_logs = this.getStorageItem('logs');
    const { year, month, day } = date;
    const date_bucket = get(stored_logs, [year, month, day], []);
    return date_bucket;
  }

  retrieveMessageFromStorage(
    date: DateBucketReference,
    message_index: number
  ): ChatLogFormat {
    const stored_logs = this.getStorageItem('logs');

    const { year, month, day } = date;
    const date_bucket = stored_logs[year][month][day];
    return date_bucket[message_index];
  }

  searchStorage(query: SearchQuery): SearchResult[] {
    const stored_indices = this.getStorageItem('terms');
    return stored_indices[query];
  }
}
