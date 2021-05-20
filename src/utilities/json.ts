import {failureFrom, Result} from './result';

export function parseJson(value: unknown): Result<Json, InvalidJsonError> {
    try {
        if (typeof value === 'string') {
            return JSON.parse(value as string);
        }
        return failureFrom(InvalidJsonError);
    } catch (error) {
        return failureFrom(InvalidJsonError);
    }
}

export type Json = object | Json[];

export const InvalidJsonError = 'InvalidJson' as const;
export type InvalidJsonError = typeof InvalidJsonError;
