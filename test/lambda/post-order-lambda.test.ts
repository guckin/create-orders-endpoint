import {failureFrom, successFrom} from '../../src/common/result';
import {stubHandlerParams, stubOrder} from '../test-helpers/stubs';
import {postOrderLambdaFactory} from '../../src/lambda/post-order-lambda';
import {StoreOrderFailure} from '../../src/orders/store-order';

describe('POST /orders lambda', () => {

    beforeEach(() => expect.hasAssertions());

    [
        {
            description: 'returns 201 when create was success',
            expectedStatusCode: 201,
            orderResult: successFrom<void>(undefined),
            body: JSON.stringify({
                items: [
                    '62284f54-6a4b-4a4a-b2c1-0597cc0fc1e2'
                ]
            })
        },
        {
            description: 'returns 400 when json is invalid',
            expectedStatusCode: 400,
            orderResult: successFrom<void>(undefined),
            body: 'this is not JSON'
        },
        {
            description: 'returns 400 when payload is invalid',
            expectedStatusCode: 400,
            orderResult: successFrom<void>(undefined),
            body: JSON.stringify({
                items: [
                    'not a valid id'
                ]
            })
        },
        {
            description: 'returns 500 when an error occurs storing the order',
            expectedStatusCode: 500,
            orderResult: failureFrom<StoreOrderFailure>(StoreOrderFailure.Unknown),
            body: JSON.stringify({
                items: [
                    '62284f54-6a4b-4a4a-b2c1-0597cc0fc1e2'
                ]
            })
        }
    ].forEach(({description, orderResult, body, expectedStatusCode}) => {
        it(description, async () => {
            const order = stubOrder();
            const result = await postOrderLambdaFactory({
                storeOrder: jest.fn(() => Promise.resolve(orderResult)),
                ordersFactory: () => order
            })(...stubHandlerParams({body}))

            expect(result).toMatchObject({statusCode: expectedStatusCode})
        });
    })
});
