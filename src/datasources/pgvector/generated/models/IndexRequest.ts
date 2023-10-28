/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DocumentData } from './DocumentData';

export type IndexRequest = {
    source: string;
    recipient: string;
    docs: Array<DocumentData>;
};

