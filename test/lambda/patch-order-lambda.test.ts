import {failureFrom, successFrom} from '../../src/common/result';
import {stubHandlerParams, stubOrder} from '../test-helpers/stubs';
import {patchOrderLambdaFactory} from '../../src/lambda/patch-order-lambda';
import {UpdateOrderFailure} from '../../src/orders/update-order';

describe('PATCH /orders/{id} lambda', () => {

    beforeEach(() => expect.hasAssertions());

    [
        {
            description: 'returns 200 when update was success',
            pathParameters: { id: '71f8b865-cc48-4cbf-a547-83f9aa4e4c6f' },
            expectedStatusCode: 200,
            orderResult: successFrom(stubOrder()),
            body: JSON.stringify({
                changes: [
                    {
                        op: 'replace',
                        path: '/status',
                        value: 'COMPLETE'
                    }
                ]
            })
        },
        {
            description: 'returns 400 when no body is provided',
            pathParameters: { id: '71f8b865-cc48-4cbf-a547-83f9aa4e4c6f' },
            expectedStatusCode: 400,
            orderResult: successFrom(stubOrder()),
            body: undefined
        },
        {
            description: 'returns 400 when no id is provided',
            pathParameters: { id: undefined },
            expectedStatusCode: 400,
            orderResult: successFrom(stubOrder()),
            body: JSON.stringify({
                changes: [
                    {
                        op: 'replace',
                        path: '/status',
                        value: 'COMPLETE'
                    }
                ]
            })
        },
        {
            description: 'returns 400 when no id is invalid',
            pathParameters: { id: 'not valid' },
            expectedStatusCode: 400,
            orderResult: successFrom(stubOrder()),
            body: JSON.stringify({
                changes: [
                    {
                        op: 'replace',
                        path: '/status',
                        value: 'COMPLETE'
                    }
                ]
            })
        },
        {
            description: 'returns 400 when no path params are provided',
            expectedStatusCode: 400,
            orderResult: successFrom(stubOrder()),
            body: JSON.stringify({
                changes: [
                    {
                        op: 'replace',
                        path: '/status',
                        value: 'COMPLETE'
                    }
                ]
            })
        },
        {
            description: 'returns 400 when not given json',
            pathParameters: { id: '71f8b865-cc48-4cbf-a547-83f9aa4e4c6f' },
            expectedStatusCode: 400,
            orderResult: successFrom(stubOrder()),
            body: 'NOT JSON'
        },
        {
            description: 'returns 400 when payload is json but not valid',
            pathParameters: { id: '71f8b865-cc48-4cbf-a547-83f9aa4e4c6f' },
            expectedStatusCode: 400,
            orderResult: successFrom(stubOrder()),
            body: JSON.stringify({
                changes: [
                    {}
                ]
            })
        },
        {
            description: 'returns 404 when patch resource is not found',
            pathParameters: { id: '71f8b865-cc48-4cbf-a547-83f9aa4e4c6f' },
            expectedStatusCode: 404,
            orderResult: failureFrom(UpdateOrderFailure.ItemNotFound),
            body: JSON.stringify({
                changes: [
                    {
                        op: 'replace',
                        path: '/status',
                        value: 'COMPLETE'
                    }
                ]
            })
        },
        {
            description: 'returns 500 when update fails for an unknown reason',
            pathParameters: { id: '71f8b865-cc48-4cbf-a547-83f9aa4e4c6f' },
            expectedStatusCode: 500,
            orderResult: failureFrom(UpdateOrderFailure.UnknownFailure),
            body: JSON.stringify({
                changes: [
                    {
                        op: 'replace',
                        path: '/status',
                        value: 'COMPLETE'
                    }
                ]
            })
        }
    ].forEach(({description, pathParameters, orderResult, body, expectedStatusCode}) => {
        it(description, async () => {
            const result = await patchOrderLambdaFactory({
                updateOrder: jest.fn(() => Promise.resolve(orderResult))
            })(...stubHandlerParams({body, pathParameters}))

            expect(result).toMatchObject({statusCode: expectedStatusCode})
        });
    })
});
