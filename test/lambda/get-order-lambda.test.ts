import {failureFrom, successFrom} from '../../src/common/result';
import {ISO8601DateTimeString} from '../../src/common/date-time';
import {UUID} from '../../src/common/uuid';
import {Order, OrderStatus} from '../../src/orders/order';
import {getOrderLambdaFactory} from '../../src/lambda/get-order-lambda';
import {stubHandlerParams} from '../test-helpers/stubs';
import {ReadOrderFailure} from '../../src/orders/read-order';

describe('GET /orders/{id} lambda', () => {
    [
        {
            description: 'returns 200 when the order is found',
            request: {
                pathParameters: {
                    id: '40fede5c-b775-43ef-8cf0-a747288cfe8b'
                }
            },
            expectedStatusCode: 200,
            orderResult: successFrom<Order>({
                createdWhen: '2021-05-21T15:02:02.190Z' as ISO8601DateTimeString,
                id: '40fede5c-b775-43ef-8cf0-a747288cfe8b' as UUID,
                items: [
                    '62284f54-6a4b-4a4a-b2c1-0597cc0fc1e2' as UUID
                ],
                status: OrderStatus.Complete
            })
        },
        {
            description: 'returns 400 when given an invalid id',
            request: {
                pathParameters: {
                    id: '💩'
                }
            },
            expectedStatusCode: 400,
            orderResult: successFrom<Order>({
                createdWhen: '2021-05-21T15:02:02.190Z' as ISO8601DateTimeString,
                id: '40fede5c-b775-43ef-8cf0-a747288cfe8b' as UUID,
                items: [
                    '62284f54-6a4b-4a4a-b2c1-0597cc0fc1e2' as UUID
                ],
                status: OrderStatus.Complete
            })
        },
        {
            description: 'returns 400 when path params is not provided',
            request: {},
            expectedStatusCode: 400,
            orderResult: successFrom<Order>({
                createdWhen: '2021-05-21T15:02:02.190Z' as ISO8601DateTimeString,
                id: '40fede5c-b775-43ef-8cf0-a747288cfe8b' as UUID,
                items: [
                    '62284f54-6a4b-4a4a-b2c1-0597cc0fc1e2' as UUID
                ],
                status: OrderStatus.Complete
            })
        },
        {
            description: 'returns 404 when order is not found',
            request: {
                pathParameters: {
                    id: '40fede5c-b775-43ef-8cf0-a747288cfe8b'
                }
            },
            expectedStatusCode: 404,
            orderResult: failureFrom(ReadOrderFailure.NotFound)
        },
        {
            description: 'returns 500 when an unknown error occurs',
            request: {
                pathParameters: {
                    id: '40fede5c-b775-43ef-8cf0-a747288cfe8b'
                }
            },
            expectedStatusCode: 500,
            orderResult: failureFrom(ReadOrderFailure.Unknown)
        }
    ].forEach(({description, orderResult, request, expectedStatusCode}) => {
        it(description, async () => {
            const result = await getOrderLambdaFactory({
                readOrder: jest.fn(() => Promise.resolve(orderResult))
            })(...stubHandlerParams(request))

            expect(result).toMatchObject({statusCode: expectedStatusCode})
        });
    });
});
