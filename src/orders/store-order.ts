import {Order} from './order';
import {failureFrom, Result, successFrom} from '../common/result';
import {inspect} from 'util';
import {DocumentClient} from 'aws-sdk/clients/dynamodb';

export type StoreOrderDependencies = {
    readonly dynamo: Pick<DocumentClient, 'put'>;
    readonly tableName: string;
};

export type StoreOrderHandler = (order: Order) => Promise<Result<void, StoreOrderFailure>>;

export const storeOrderHandlerFactory = (
    {
        dynamo,
        tableName
    }: StoreOrderDependencies
): StoreOrderHandler => async order => {
    console.log('Storing Order:', inspect(order, {depth: 50}));
    try {
        await dynamo.put({
            Item: order,
            TableName: tableName
        }).promise();
        return successFrom(undefined);
    } catch (error) {
        console.error('🚨 ERROR 🚨', '----', error);
        return failureFrom(StoreOrderFailure.Unknown);
    }
};

export const StoreOrderFailure = {
    Unknown: 'Unknown'
} as const;

export type StoreOrderFailure = typeof StoreOrderFailure[keyof typeof StoreOrderFailure];
