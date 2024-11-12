/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommentRequest } from './CommentRequest';
import type { Coordinates } from './Coordinates';
import type { SignItem } from './SignItem';
export type RouteReportRequest = {
    startPoint: Coordinates;
    endPoint: Coordinates;
    recognizedSigns: Array<SignItem>;
    comments: Array<CommentRequest>;
};

