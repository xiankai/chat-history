/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DocumentData } from '../models/DocumentData';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DefaultService {

    /**
     * Index
     * @returns any Document created, URL follows
     * @throws ApiError
     */
    public static indexIndex({
        source,
        recipient,
        docs,
    }: {
        source: string,
        recipient: string,
        docs: Array<DocumentData>,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/index',
            query: {
                'source': source,
                'recipient': recipient,
                'docs': docs,
            },
            errors: {
                400: `Bad request syntax or unsupported method`,
            },
        });
    }

    /**
     * Recipients
     * @returns string Request fulfilled, document follows
     * @throws ApiError
     */
    public static recipientsRecipients({
        source,
    }: {
        source: string,
    }): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/recipients',
            query: {
                'source': source,
            },
            errors: {
                400: `Bad request syntax or unsupported method`,
            },
        });
    }

}
