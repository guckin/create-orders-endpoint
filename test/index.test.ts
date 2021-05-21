import {APIGatewayProxyEventV2, APIGatewayProxyHandlerV2} from 'aws-lambda';
import {dynamo, getOrderLambda, postOrderLambda} from '../src/lambdas';
import {Order} from '../src/orders/order';
import {UUID} from '../src/common/uuid';
import {ISO8601DateTimeString} from '../src/common/date-time';

describe('index.ts', () => {
    describe('postOrderLambda', () => {
        it('returns the query params and path parameters`', async () => {
            dynamo.put = jest.fn(() => {
                return {
                    promise: () => Promise.resolve({})
                };
            }) as jest.Mock;
            const params = stubHandlerParams({
                body: JSON.stringify({
                    items: [
                        '40fede5c-b775-43ef-8cf0-a747288cfe8b',
                        '5c3c58f2-c015-47fb-a593-26c0d021e444'
                    ]
                })
            });

            const result = await postOrderLambda(...params);

            expect(result).toMatchObject({statusCode: 201});
        });
    });

    describe('getOrderLambda', () => {
        it('returns the query params and path parameters`', async () => {
            const id = '62284f54-6a4b-4a4a-b2c1-0597cc0fc1e2' as UUID;
            const order: Order = {
                id,
                createdWhen: '2021-05-21T15:02:02.190Z' as ISO8601DateTimeString,
                items: [
                    '40fede5c-b775-43ef-8cf0-a747288cfe8b' as UUID,
                    '5c3c58f2-c015-47fb-a593-26c0d021e444' as UUID
                ]
            };
            dynamo.get = jest.fn(() => {
                return {
                    promise: () => Promise.resolve({Item: order})
                };
            }) as jest.Mock;
            const params = stubHandlerParams({
                pathParameters: {id}
            });

            const result = await getOrderLambda(...params);

            expect(result).toMatchObject({
                statusCode: 200,
                body: JSON.stringify(order)
            });
        });
    });
});

function stubHandlerParams(partial: Partial<APIGatewayProxyEventV2> = {}): Parameters<APIGatewayProxyHandlerV2> {
    return [
        {...partial},
        undefined,
        undefined
    ] as unknown as Parameters<APIGatewayProxyHandlerV2>;
}


