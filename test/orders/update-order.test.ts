import { UUID } from '../../src/common/uuid';
import {UpdateOrderFailure, updateOrderHandlerFactory} from '../../src/orders/update-order';
import {OrderStatus} from '../../src/orders/order';
import {failureFrom, successFrom} from '../../src/common/result';

describe('', () => {
    [
        {
            description: 'updates an order',
            updates: [
                {
                    field: 'status',
                    value: OrderStatus.Pending
                } as const,
                {
                    field: 'status',
                    value: OrderStatus.Complete
                } as const
            ],
            updateResult: Promise.resolve({
                Attributes: {
                    test: 'test'
                }
            }),
            expectedExpression: {
                UpdateExpression: 'SET #a = :a, #b = :b',
                ExpressionAttributeValues: {
                    ':a': 'PENDING',
                    ':b': 'COMPLETE'
                },
                ExpressionAttributeNames: {
                    '#a': 'status',
                    '#b': 'status'
                }
            },
            expectedResult: successFrom({
                test: 'test'
            })
        },
        {
            description: 'returns an error if the update fails',
            updates: [
                {
                    field: 'status',
                    value: OrderStatus.Created
                } as const
            ],
            updateResult: Promise.reject('Something bad happened'),
            expectedExpression: {
                UpdateExpression: 'SET #a = :a',
                ExpressionAttributeValues: {
                    ':a': 'CREATED'
                },
                ExpressionAttributeNames: {
                    '#a': 'status'
                }
            },
            expectedResult: failureFrom(UpdateOrderFailure.UnknownFailure)
        }
    ].forEach(({description, updates, updateResult, expectedExpression, expectedResult}) => {
        it(description, async () => {
            const dynamo = {update: jest.fn(() => ({promise: () => updateResult})) as jest.Mock};
            const id = 'ce70087f-9bc3-4fc5-b5d5-e74c3315d330' as UUID;

            const result = await updateOrderHandlerFactory({
                dynamo,
                tableName: 'tableName'
            })(id, updates);

            expect(dynamo.update).toBeCalledWith({
                TableName: 'tableName',
                Key: {id},
                ReturnValues: 'ALL_NEW',
                ...expectedExpression
            });
            expect(result).toEqual(expectedResult);
        });
    });
});
