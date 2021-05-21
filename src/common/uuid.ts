import { string } from "joi";

export type UUID = string & {readonly _brand_: 'UUID'};

export function isUUID(value: unknown): value is UUID {
    const {error} = string().uuid().validate(value);
    return !error;
}
