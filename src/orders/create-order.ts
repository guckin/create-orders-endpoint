import {Order} from './order';
import {failureFrom, Result, successFrom} from '../utilities/result';
import {array, createSerializer, string} from '../dynamo/serialize';
import {DynamoDB} from 'aws-sdk';
import {inspect} from 'util';

export interface CreateOrderDependencies {
    readonly dynamo: Pick<DynamoDB, 'putItem'>;
    readonly tableName: string;
}

export type CreateOrderHandler = (order: Order) => Promise<Result<void, CreateOrderFailure>>;

export function createOrderHandlerFactory({dynamo, tableName}: CreateOrderDependencies): CreateOrderHandler {
    return async order => {
        console.log('Creating Order:', inspect(order, { depth: 50 }));
        const item = serializeOrder(order);
        console.log('Sending Item to DynamoDB:', inspect(item, { depth: 50 }));
        try {
            await dynamo.putItem({
                Item: item,
                TableName: tableName
            }).promise();
            return successFrom(undefined);
        } catch (error) {
            console.error('🚨 ERROR 🚨', '----', error);
            return failureFrom(CreateOrderFailure.Unknown);
        }
    }
}

export const CreateOrderFailure = {
    Unknown: 'Unknown'
} as const;

export type CreateOrderFailure = typeof CreateOrderFailure[keyof typeof CreateOrderFailure];

const serializeOrder = createSerializer<Order>({
    id: string(),
    createdWhen: string(),
    items: array(string())
});
