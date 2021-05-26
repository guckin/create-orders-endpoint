import {Order} from './order';
import {UUID} from '../common/uuid';
import {ISO8601DateTimeString} from '../common/date-time';

export interface OrdersFactoryDependencies {
    readonly uuid: () => UUID;
    readonly now: () => ISO8601DateTimeString;
}
export type OrdersFactory = (partialOrder: Pick<Order, 'items'>) => Order;

export function ordersFactoryFactory({uuid, now}: OrdersFactoryDependencies): OrdersFactory {
    return ({items}) => ({
        items,
        id: uuid(),
        createdWhen: now()
    });
}
