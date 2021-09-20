import {APIGatewayProxyEventV2, APIGatewayProxyHandlerV2} from 'aws-lambda';
import {NewOrder, Order, OrderStatus} from '../../src/orders/order';
import {ISO8601DateTimeString} from '../../src/common/date-time';
import {UUID} from '../../src/common/uuid';

export const stubHandlerParams = (
    partial: Partial<APIGatewayProxyEventV2> = {}
): Parameters<APIGatewayProxyHandlerV2> => ([
    partial,
    undefined,
    undefined
] as unknown as Parameters<APIGatewayProxyHandlerV2>);

export const stubOrder = (order: Partial<Order> = {}): Order => ({
    createdWhen: '2021-05-21T15:02:02.190Z' as ISO8601DateTimeString,
    id: '40fede5c-b775-43ef-8cf0-a747288cfe8b' as UUID,
    items: [
        '62284f54-6a4b-4a4a-b2c1-0597cc0fc1e2' as UUID
    ],
    status: OrderStatus.Pending,
    ...order
});

export const stubNewOrder = (order: Partial<NewOrder> = {}): NewOrder => ({
    createdWhen: '2021-05-21T15:02:02.190Z' as ISO8601DateTimeString,
    id: '40fede5c-b775-43ef-8cf0-a747288cfe8b' as UUID,
    items: [
        '62284f54-6a4b-4a4a-b2c1-0597cc0fc1e2' as UUID
    ],
    status: OrderStatus.Created,
    ...order
});
