import {Order} from './order';
import {failureFrom, Result, successFrom} from '../utilities/result';
import {DynamoDB} from 'aws-sdk';
import {UUID} from '../common/uuid';
import {DocumentClient} from 'aws-sdk/clients/dynamodb';

export interface ReadOrderDependencies {
    readonly dynamo: Pick<DocumentClient, 'get'>;
    readonly tableName: string;
}

export type ReadOrderHandler = (id: UUID) => Promise<Result<Order, ReadOrderFailure>>;

export function readOrderHandlerFactory({dynamo, tableName}: ReadOrderDependencies): ReadOrderHandler {
    return async id => {
        try {
            const {Item} = await dynamo.get({
                Key: {
                    id
                },
                TableName: tableName
            }).promise();
            return Item ?
                // TODO should validate the order before casting;
                successFrom(Item as Order) :
                failureFrom(ReadOrderFailure.NotFound);
        } catch (error) {
            console.error('🚨 ERROR 🚨', '----', error);
            return failureFrom(ReadOrderFailure.Unknown);
        }
    }
}

export const ReadOrderFailure = {
    Unknown: 'Unknown',
    NotFound: 'NotFound'
} as const;

export type ReadOrderFailure = typeof ReadOrderFailure[keyof typeof ReadOrderFailure];
