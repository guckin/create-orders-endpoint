import {AttributeValue, MapAttributeValue} from 'aws-sdk/clients/dynamodb';
import {cast} from '../utilities/cast';

export type TypeMapper<T> = (value: AttributeValue) => T;

export type ObjectMapping<T> = {
    [Key in keyof T]: TypeMapper<T[Key]>;
};

export function createDeserializer<T>(mapping: ObjectMapping<T>): (value: MapAttributeValue) => T {
    return obj => {
        const entries: [keyof T, AttributeValue][] = cast(Object.entries(obj));
        const pairs = entries.map(createKeyDeserializer(mapping));
        return reduceKeysValuePairsToObject(pairs);
    };
}

export function object<T>(mapping: ObjectMapping<T>): TypeMapper<T> {
    return ({M}) => createDeserializer(mapping)(M ?? {});
}

type KeyDeserializer<T, K extends keyof T> = ([key, value]: [K, AttributeValue]) => [K, T[K]]

function createKeyDeserializer<T, K extends keyof T>(mapping: ObjectMapping<T>): KeyDeserializer<T, K> {
    return ([key, value]) => [key, mapping[key](value)];
}

function reduceKeysValuePairsToObject<T>(allPairs: [keyof T, T[keyof T]][]): T {
    return allPairs.reduce((prev, [key, value]) => ({...prev, [key]: value}), {} as T)
}

export function array<T>(mapper: TypeMapper<T>): TypeMapper<T[]> {
    return ({L}) => L?.map(mapper) as T[];
}

export function string(): TypeMapper<string> {
    return ({S}) => S as string;
}

export function number(): TypeMapper<number> {
    return ({N}) => Number(N);
}
