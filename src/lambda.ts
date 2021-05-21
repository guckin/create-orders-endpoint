import {createHandler} from './handler';
import {createOrderHandlerFactory} from './orders/create-order';
import {ISO8601DateTimeString} from './common/date-time';
import {v4} from 'uuid';
import {UUID} from './common/uuid';
import {DocumentClient} from 'aws-sdk/clients/dynamodb';

export const tableName = process.env.TABLE_NAME ?? '';
export const dynamo = new DocumentClient();
export const createOrder = createOrderHandlerFactory({
    dynamo,
    tableName
})
export const now = () => new Date().toISOString() as ISO8601DateTimeString;
export const uuid = () => v4() as UUID;

export const handler = createHandler({
    createOrder,
    now,
    uuid
});
