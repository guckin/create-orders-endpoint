import {UUID} from '../common/uuid';
import {ISO8601DateTimeString} from '../common/date-time';

export interface Order {
    readonly id: UUID;
    readonly createdWhen: ISO8601DateTimeString;
    readonly items: UUID[];
    readonly status: OrderStatus;
}

export type NewOrder = Order & {
    status: typeof OrderStatus.Pending;
};

export const OrderStatus = {
    Complete: 'Complete',
    Pending: 'Pending'
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];
