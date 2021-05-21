import {postOrderLambdaFactory} from './lambda/post-order-lambda';
import {storeOrderHandlerFactory} from './orders/store-order';
import {ISO8601DateTimeString} from './common/date-time';
import {v4} from 'uuid';
import {UUID} from './common/uuid';
import {DocumentClient} from 'aws-sdk/clients/dynamodb';
import {getOrderLambdaFactory} from './lambda/get-order-lambda';
import {readOrderHandlerFactory} from './orders/read-order';

export const dynamo = new DocumentClient();

const tableName = process.env.TABLE_NAME ?? '';
const storeOrder = storeOrderHandlerFactory({
    dynamo,
    tableName
});
const now = () => new Date().toISOString() as ISO8601DateTimeString;
const uuid = () => v4() as UUID;

export const postOrderLambda = postOrderLambdaFactory({
    storeOrder,
    now,
    uuid
});

const readOrder = readOrderHandlerFactory({
    dynamo,
    tableName
});

export const getOrderLambda = getOrderLambdaFactory({readOrder})
