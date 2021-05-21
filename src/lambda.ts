import {createHandler} from './handler';
import {createOrderHandlerFactory} from './orders/create-order';
import {DynamoDB} from 'aws-sdk';
import {ISO8601DateTimeString} from './common/date-time';
import {v4} from 'uuid';
import {UUID} from './common/uuid';

const tableName = process.env.TABLE_NAME ?? '';
const dynamo = new DynamoDB();
const createOrder = createOrderHandlerFactory({
    dynamo,
    tableName
})
const now = () => new Date().toISOString() as ISO8601DateTimeString;
const uuid = () => v4() as UUID;

export const handler = createHandler({
    createOrder,
    now,
    uuid
});
