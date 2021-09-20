import {UUID} from '../common/uuid';
import {ISO8601DateTimeString} from '../common/date-time';

export type Order = {
    readonly id: UUID;
    readonly createdWhen: ISO8601DateTimeString;
    readonly items: UUID[];
    readonly status: OrderStatus;
};

export type NewOrder = Order & {
    status: typeof OrderStatus.Created;
};

export const OrderStatus = {
    Complete: 'COMPLETE',
    Pending: 'PENDING',
    Created: 'CREATED',
} as const;

export const OrderStatuses = Object.values(OrderStatus);

export type OrderStatus = typeof OrderStatuses[number];
