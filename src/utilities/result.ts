export interface Success<T> {
    _type_: 'Success';
    value: T;
}

export interface Failure<E> {
    _type_: 'Failure';
    error: E;
}

export type Result<T, E> = Success<T> | Failure<E>;

export function successFrom<T>(value: T): Success<T> {
    return {
        _type_: 'Success',
        value
    };
}

export function failureFrom<E>(error: E): Failure<E> {
    return {
        _type_: 'Failure',
        error
    };
}

export function isSuccess<T, E>(val: Result<T, E>): val is Success<T> {
    return val._type_ === 'Success';
}
