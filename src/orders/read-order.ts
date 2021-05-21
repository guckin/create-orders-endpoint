import {Order} from './order';
import {failureFrom, Result, successFrom} from '../utilities/result';
import {DynamoDB} from 'aws-sdk';
import {array, createDeserializer, string} from '../dynamo/deserialize';
import {UUID} from '../common/uuid';

export interface ReadOrderDependencies {
    readonly dynamo: Pick<DynamoDB, 'getItem'>;
    readonly tableName: string;
}

export type ReadOrderHandler = (id: UUID) => Promise<Result<Order, ReadOrderFailure>>;

export function readOrderHandlerFactory({dynamo, tableName}: ReadOrderDependencies): ReadOrderHandler {
    return async id => {
        try {
            const {Item} = await dynamo.getItem({
                Key: {
                    id: {S: id}
                },
                TableName: tableName
            }).promise();
            return Item ?
                // TODO should validate the order before casting;
                successFrom(deserializeOrder(Item) as Order) :
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

const deserializeOrder = createDeserializer<unknown>({
    id: string(),
    createdWhen: string(),
    items: array(string())
});
