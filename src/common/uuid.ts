import { string } from "joi";

export type UUID = string & {readonly _brand_: 'UUID'};

export function isUUID(value: unknown): value is UUID {
    const {error} = string().uuid().required().validate(value);
    return !error;
}
