import {failureFrom, Result, successFrom} from './result';

export const parseJson = (value: unknown): Result<Json, InvalidJsonError> => {
    try {
        return typeof value === 'string' ?
            successFrom(JSON.parse(value)) :
            failureFrom(InvalidJsonError);
    } catch (error) {
        return failureFrom(InvalidJsonError);
    }
};

export type Json = object | Json[];

export const InvalidJsonError = 'InvalidJson' as const;
export type InvalidJsonError = typeof InvalidJsonError;
