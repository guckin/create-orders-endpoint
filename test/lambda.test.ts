import {handler} from '../src/lambda';
import {APIGatewayProxyEventV2, APIGatewayProxyHandlerV2} from 'aws-lambda';
import {dynamo} from '../src/lambda';

describe('handler', () => {
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

        const result = await handler(...params);

        expect(result).toMatchObject({statusCode: 201});
    });
});

function stubHandlerParams(partial: Partial<APIGatewayProxyEventV2> = {}): Parameters<APIGatewayProxyHandlerV2> {
    return [
        {...partial},
        undefined,
        undefined
    ] as unknown as Parameters<APIGatewayProxyHandlerV2>;
}


