import {DocumentClient} from 'aws-sdk/lib/dynamodb/document_client';
import {Order, OrderStatus} from './order';
import {failureFrom, Result, successFrom} from '../common/result';
import {UUID} from '../common/uuid';

export interface UpdateOrderHandlerDependencies {
    dynamo: Pick<DocumentClient, 'update'>;
    tableName: string;
}

export type UpdateOrderHandler = (id: UUID, updates: OrderUpdate[]) => Promise<Result<Order, UpdateOrderFailure>>;

export function updateOrderHandlerFactory({dynamo, tableName}: UpdateOrderHandlerDependencies): UpdateOrderHandler {
    return async (id, updates) => {
        try {
            const {Attributes} = await dynamo.update({
                TableName: tableName,
                Key: {id},
                ReturnValues: 'ALL_NEW',
                ...serializeUpdates(updates)
            }).promise();
            // TODO should validate the order before casting
            return successFrom(Attributes as Order);
        } catch (error) {
            console.error('🚨 ERROR 🚨', '----', error);
            return failureFrom(UpdateOrderFailure.UnknownFailure);
        }
    };
}

export type OrderUpdate = OrderStatusUpdate;

export interface OrderStatusUpdate {
    field: 'status';
    value: OrderStatus;
}

export const UpdateOrderFailure = {
    UnknownFailure: 'UnknownFailure',
    ItemNotFound: 'ItemNotFound'
} as const;

export type UpdateOrderFailure = typeof UpdateOrderFailure[keyof typeof UpdateOrderFailure];

type SerializedUpdate = Required<Pick<DocumentClient.UpdateItemInput, 'UpdateExpression' | 'ExpressionAttributeValues'>>;

function serializeUpdates(updates: OrderUpdate[]): SerializedUpdate {
    const intermediates = updates.map(mapToIntermediate);
    return {
        UpdateExpression: `SET ${intermediates.reduce(accumulateSetExpressionUpdates, []).join(', ')}`,
        ExpressionAttributeValues: intermediates.reduce(accumulateAttributeValueMap, {})
    };
}

function mapToIntermediate(update: OrderUpdate, index: number): UpdateIntermediate<OrderStatus> {
    const key = `key${index}`;
    return {
        key,
        expression: `status = :${key}`,
        operation: 'SET',
        value: update.value
    };
}

type IntermediateReducer<T> = (prev: T, cur: UpdateIntermediate<OrderStatus>) => T;

const accumulateAttributeValueMap: IntermediateReducer<DocumentClient.ExpressionAttributeValueMap> = (prev, cur) => ({
    ...prev,
    [cur.key]: cur.value
});

//TODO: Add a conditional once we add new types of expression operations
const accumulateSetExpressionUpdates: IntermediateReducer<string[]> = (prev, curr) => [...prev, curr.expression]

interface UpdateIntermediate<T> {
    key: string;
    expression: string;
    operation: 'SET';
    value: T;
}
