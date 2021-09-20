export type Success<T> = {
    readonly _type_: 'Success';
    readonly value: T;
};

export type Failure<E> = {
    readonly _type_: 'Failure';
    readonly error: E;
};

export type Result<T, E> = Success<T> | Failure<E>;

export const successFrom = <T>(value: T): Success<T> => ({
    _type_: 'Success',
    value
});

export const failureFrom = <E>(error: E): Failure<E> => ({
    _type_: 'Failure',
    error
});

export const isSuccess = <T, E>(val: Result<T, E>): val is Success<T> => val._type_ === 'Success';
