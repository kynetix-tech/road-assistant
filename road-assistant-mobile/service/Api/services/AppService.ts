/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AppService {
    /**
     * @returns any
     * @throws ApiError
     */
    public static getPublic(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/public',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static getPrivate(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/private',
        });
    }
}
