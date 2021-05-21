import {AttributeValue, MapAttributeValue} from 'aws-sdk/clients/dynamodb';
import {cast} from '../utilities/cast';

export type TypeMapper<T> = (value: T) => AttributeValue;

export type ObjectMapping<T> = {
    [Key in keyof T]: TypeMapper<T[Key]>;
};

export function createSerializer<T>(mapping: ObjectMapping<T>): (value: T) => MapAttributeValue {
    return obj => {
        const entries = cast<[keyof T, T[keyof T]][]>(Object.entries(obj));
        const attributeValues = entries.map(([key, value]) => [key, mapping[key](value)] as const);
        return attributeValues.reduce((prev, [key, attributeValue]) => ({[key]: attributeValue}), {});
    };
}

export function object<T>(mapping: ObjectMapping<T>): TypeMapper<T> {
    return obj => ({
        M: createSerializer(mapping)(obj)
    });
}

export function custom<T>(fn: (value: T) => TypeMapper<T>): TypeMapper<T> {
    return value => fn(value)(value);
}

export function array<T>(mapper: TypeMapper<T>): TypeMapper<T[]> {
    return values => ({
        L: values.map(mapper)
    });
}

export function string(): TypeMapper<string> {
    return value => ({S: value});
}

export function number(): TypeMapper<number> {
    return value => ({N: `${value}`});
}
