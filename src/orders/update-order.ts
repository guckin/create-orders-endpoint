import {DocumentClient} from 'aws-sdk/lib/dynamodb/document_client';
import {Order, OrderStatus} from './order';
import {Result} from '../common/result';

export type UpdateOrderHandler = (updates: OrderUpdate[]) => Promise<Result<Order, UpdateOrderFailure>>;

export type OrderUpdate = OrderStatusUpdate;

export interface OrderStatusUpdate {
    field: 'status';
    value: OrderStatus;
}

export const UpdateOrderFailure = {
    UnknownFailure: 'UnknownFailure',
    ItemNotFound: 'ItemNotFound'
} as const;

export type UpdateOrderFailure = typeof UpdateOrderFailure[keyof typeof UpdateOrderFailure];

