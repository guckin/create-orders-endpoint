import {DocumentClient} from 'aws-sdk/lib/dynamodb/document_client';
import {Order, OrderStatus} from './order';
import {failureFrom, Result, successFrom} from '../common/result';
import {UUID} from '../common/uuid';

export type UpdateOrderHandlerDependencies = {
    readonly dynamo: Pick<DocumentClient, 'update'>;
    readonly tableName: string;
};

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

export type OrderStatusUpdate = {
    readonly field: 'status';
    readonly value: OrderStatus;
};

export const UpdateOrderFailure = {
    UnknownFailure: 'UnknownFailure',
    ItemNotFound: 'ItemNotFound'
} as const;

export type UpdateOrderFailure = typeof UpdateOrderFailure[keyof typeof UpdateOrderFailure];

type SerializedUpdate = Required<Pick<DocumentClient.UpdateItemInput, 'UpdateExpression' | 'ExpressionAttributeValues' | 'ExpressionAttributeNames'>>;

function serializeUpdates(updates: OrderUpdate[]): SerializedUpdate {
    const intermediates = updates.map(mapToIntermediate);
    return {
        UpdateExpression: `SET ${intermediates.reduce(accumulateSetExpressionUpdates, []).join(', ')}`,
        ExpressionAttributeValues: intermediates.reduce(accumulateAttributeValueMap, {}),
        ExpressionAttributeNames: intermediates.reduce(accumulateAttributeNameMap, {})
    };
}

function mapToIntermediate(update: OrderUpdate, index: number): UpdateIntermediate<'status'> {
    const attributeValueKey = `:${keyFromIndex(index)}` as const;
    const attributeFieldKey = `#${keyFromIndex(index)}` as const;
    return {
        operation: 'SET',
        attributeValueKey,
        attributeFieldKey,
        value: update.value,
        field: 'status'
    };
}

export type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

function keyFromIndex(index: number): string {
    return `${index.toString().split('').map(encodeDigit).join()}`;
}

function encodeDigit(num: Digit): string {
    return {
        '0': 'a',
        '1': 'b',
        '2': 'c',
        '3': 'b',
        '4': 'd',
        '5': 'e',
        '6': 'f',
        '7': 'g',
        '8': 'h',
        '9': 'i'
    }[num];
}

type IntermediateReducer<T> = (prev: T, cur: UpdateIntermediate<'status'>) => T;

const accumulateSetExpressionUpdates: IntermediateReducer<string[]> = (prev, curr) => [
    ...prev,
    `${curr.attributeFieldKey} = ${curr.attributeValueKey}`
]

const accumulateAttributeValueMap: IntermediateReducer<DocumentClient.ExpressionAttributeValueMap> = (prev, cur) => ({
    ...prev,
    [cur.attributeValueKey]: cur.value
});

const accumulateAttributeNameMap: IntermediateReducer<DocumentClient.ExpressionAttributeNameMap> = (prev, cur) => ({
    ...prev,
    [cur.attributeFieldKey]: cur.field
});
//TODO: Add a conditional once we add new types of expression operations

type UpdateIntermediate<K extends keyof Order> = {
    operation: 'SET';
    attributeValueKey: `:${string}`;
    attributeFieldKey: `#${string}`;
    field: K;
    value: Order[K];
};
