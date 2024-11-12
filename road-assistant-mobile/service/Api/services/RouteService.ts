/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RouteReportRequest } from '../models/RouteReportRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RouteService {
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static addNewReport(
        requestBody: RouteReportRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/route/route-report',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static getRoutesForUser(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/route/routes',
        });
    }
}
