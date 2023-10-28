/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DocumentResponse } from '../models/DocumentResponse';
import type { IndexRequest } from '../models/IndexRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DefaultService {

    /**
     * Day
     * @returns DocumentResponse Request fulfilled, document follows
     * @throws ApiError
     */
    public static dayDay({
        day,
        source,
        recipient,
    }: {
        day: string,
        source: string,
        recipient: string,
    }): CancelablePromise<Array<DocumentResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/day',
            query: {
                'day': day,
                'source': source,
                'recipient': recipient,
            },
            errors: {
                400: `Bad request syntax or unsupported method`,
            },
        });
    }

    /**
     * FirstDay
     * @returns DocumentResponse Request fulfilled, document follows
     * @throws ApiError
     */
    public static firstDayFirstDay({
        source,
        recipient,
    }: {
        source: string,
        recipient: string,
    }): CancelablePromise<Array<DocumentResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/first_day',
            query: {
                'source': source,
                'recipient': recipient,
            },
            errors: {
                400: `Bad request syntax or unsupported method`,
            },
        });
    }

    /**
     * Index
     * @returns any Document created, URL follows
     * @throws ApiError
     */
    public static indexIndex({
        requestBody,
    }: {
        requestBody: IndexRequest,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/index',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request syntax or unsupported method`,
            },
        });
    }

    /**
     * LastDay
     * @returns DocumentResponse Request fulfilled, document follows
     * @throws ApiError
     */
    public static lastDayLastDay({
        source,
        recipient,
    }: {
        source: string,
        recipient: string,
    }): CancelablePromise<Array<DocumentResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/last_day',
            query: {
                'source': source,
                'recipient': recipient,
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

    /**
     * Search
     * @returns DocumentResponse Request fulfilled, document follows
     * @throws ApiError
     */
    public static searchSearch({
        q,
        fromDate,
        toDate,
        recipient,
        source,
    }: {
        q: string,
        fromDate?: (null | string),
        toDate?: (null | string),
        recipient?: (null | string),
        source?: (null | string),
    }): CancelablePromise<Array<DocumentResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/search',
            query: {
                'q': q,
                'from_date': fromDate,
                'to_date': toDate,
                'recipient': recipient,
                'source': source,
            },
            errors: {
                400: `Bad request syntax or unsupported method`,
            },
        });
    }

}
