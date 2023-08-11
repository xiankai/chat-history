/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DocumentDataFull } from '../models/DocumentDataFull';
import type { Documents } from '../models/Documents';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DefaultService {

    /**
     * Recipients
     * @returns string Successful Response
     * @throws ApiError
     */
    public static recipientsRecipientsGet({
        firebaseToken,
    }: {
        firebaseToken?: string,
    }): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/recipients',
            cookies: {
                'firebase_token': firebaseToken,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Search
     * @returns DocumentDataFull Successful Response
     * @throws ApiError
     */
    public static searchSearchGet({
        q,
        fromDate = '',
        toDate = '',
        limit = 10,
        offset,
        sortBy = 'timestamp_ms',
        order = 'desc',
        recipient = '',
        source = '',
        firebaseToken,
    }: {
        q: string,
        fromDate?: string,
        toDate?: string,
        limit?: number,
        offset?: number,
        sortBy?: string,
        order?: string,
        recipient?: string,
        source?: string,
        firebaseToken?: string,
    }): CancelablePromise<Array<DocumentDataFull>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/search',
            cookies: {
                'firebase_token': firebaseToken,
            },
            query: {
                'q': q,
                'from_date': fromDate,
                'to_date': toDate,
                'limit': limit,
                'offset': offset,
                'sort_by': sortBy,
                'order': order,
                'recipient': recipient,
                'source': source,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Day
     * @returns DocumentDataFull Successful Response
     * @throws ApiError
     */
    public static dayDayGet({
        date,
        recipient,
        source,
        firebaseToken,
    }: {
        date: string,
        recipient: string,
        source: string,
        firebaseToken?: string,
    }): CancelablePromise<Array<DocumentDataFull>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/day',
            cookies: {
                'firebase_token': firebaseToken,
            },
            query: {
                'date': date,
                'recipient': recipient,
                'source': source,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Day
     * @returns DocumentDataFull Successful Response
     * @throws ApiError
     */
    public static dayFirstDayGet({
        recipient,
        source,
        firebaseToken,
    }: {
        recipient: string,
        source: string,
        firebaseToken?: string,
    }): CancelablePromise<Array<DocumentDataFull>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/first_day',
            cookies: {
                'firebase_token': firebaseToken,
            },
            query: {
                'recipient': recipient,
                'source': source,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Day
     * @returns DocumentDataFull Successful Response
     * @throws ApiError
     */
    public static dayLastDayGet({
        recipient,
        source,
        firebaseToken,
    }: {
        recipient: string,
        source: string,
        firebaseToken?: string,
    }): CancelablePromise<Array<DocumentDataFull>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/last_day',
            cookies: {
                'firebase_token': firebaseToken,
            },
            query: {
                'recipient': recipient,
                'source': source,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Index
     * @returns any Successful Response
     * @throws ApiError
     */
    public static indexIndexPost({
        requestBody,
        firebaseToken,
    }: {
        requestBody: Documents,
        firebaseToken?: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/index',
            cookies: {
                'firebase_token': firebaseToken,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteDeleteDelete({
        recipient,
        source,
        firebaseToken,
    }: {
        recipient: string,
        source: string,
        firebaseToken?: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/delete',
            cookies: {
                'firebase_token': firebaseToken,
            },
            query: {
                'recipient': recipient,
                'source': source,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
