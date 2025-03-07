/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserRegisterRequest } from '../models/UserRegisterRequest';
import type { UserResponse } from '../models/UserResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
    /**
     * @param requestBody
     * @returns UserResponse
     * @throws ApiError
     */
    public static upsert(
        requestBody: UserRegisterRequest,
    ): CancelablePromise<UserResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/upsert',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns UserResponse
     * @throws ApiError
     */
    public static getCurrentUser(): CancelablePromise<UserResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/current',
        });
    }
}
