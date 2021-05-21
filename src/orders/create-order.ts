import {Order} from './order';
import {failureFrom, Result, successFrom} from '../utilities/result';
import {inspect} from 'util';
import {DocumentClient} from 'aws-sdk/clients/dynamodb';

export interface CreateOrderDependencies {
    readonly dynamo: Pick<DocumentClient, 'put'>;
    readonly tableName: string;
}

export type CreateOrderHandler = (order: Order) => Promise<Result<void, CreateOrderFailure>>;

export function createOrderHandlerFactory({dynamo, tableName}: CreateOrderDependencies): CreateOrderHandler {
    return async order => {
        console.log('Creating Order:', inspect(order, { depth: 50 }));
        try {
            await dynamo.put({
                Item: order,
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
