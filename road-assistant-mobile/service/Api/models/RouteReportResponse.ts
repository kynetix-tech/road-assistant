/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommentResponse } from './CommentResponse';
import type { Coordinates } from './Coordinates';
import type { SignItem } from './SignItem';
export type RouteReportResponse = {
    id: number;
    createdAt: string;
    startPoint: Coordinates;
    endPoint: Coordinates;
    recognizedSigns: Array<SignItem>;
    userId: string;
    comments: Array<CommentResponse>;
};

