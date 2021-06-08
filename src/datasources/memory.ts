import has from 'lodash/has';
import get from 'lodash/get';
import set from 'lodash/set';
import { parseTimestampIntoDateBucket } from '../utils/date';
import BaseDatasource, { Term, DateBucketReference, LineNumber, ChatLogFormat, Timestamp, Message, Source, SourceMetadata, SearchQuery } from './base';

type SearchResult = [DateBucketReference, LineNumber];

interface MemoryDatasourceIndex {
    [term: string]: SearchResult[];
}

interface DateBuckets {
    [year: number]: {
        [month: number]: {
            [day: number]: ChatLogFormat[]
        }
    }
}

interface MemoryDatasourceStorage {
    index: MemoryDatasourceIndex;
    logs: DateBuckets
}

export default class MemoryDatasource extends BaseDatasource {
    store: MemoryDatasourceStorage = {
        index: {},
        logs: {},
    };

    addToIndex(line_number: LineNumber, timestamp: Timestamp, terms: Term[]) {
        const date = parseTimestampIntoDateBucket(timestamp);
        for (const i in terms) {
            const term = terms[i];
            if (this.store.index[term]) {
                this.store.index[term].push([date, line_number]);
            } else {
                this.store.index[term] = [[date, line_number]];
            }
        }
    }

    addToStorage(line_number: LineNumber, timestamp: Timestamp, message: Message, source: Source, source_metadata: SourceMetadata) {
        const { year, month, day } = parseTimestampIntoDateBucket(timestamp);
        const chat_log: ChatLogFormat = [line_number, timestamp, message, source, source_metadata];
        if (has(this.store.logs, [year,month,day])) {
            this.store.logs[year][month][day].push(chat_log);
        } else {
            set(this.store.logs, [year, month, day].map(String),  [chat_log]);
        }
    }

    retrieveBucketFromStorage(date: DateBucketReference): ChatLogFormat[] {
        const { year, month, day } = date;
        const date_bucket = get(this.store.logs, [year,month,day], []);
        return date_bucket;
    }

    retrieveMessageFromStorage(date: DateBucketReference, message_index: number): ChatLogFormat {
        const { year, month, day } = date;
        const date_bucket = this.store.logs[year][month][day];
        return date_bucket[message_index];
    }

    searchStorage(query: SearchQuery): SearchResult[] {
        return this.store.index[query];
    }
}