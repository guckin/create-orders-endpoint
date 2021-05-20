import {handler} from '../src/lambda';
import {APIGatewayProxyEventV2, APIGatewayProxyHandlerV2} from 'aws-lambda';
import {v4} from 'uuid';

describe('handler', () => {
    it('returns the query params and path parameters`', async () => {
        const uuid = v4();
        const params = mockHandlerParams({pathParameters: {id: uuid}});

        const result = await handler(...params);

        expect(result).toEqual({statusCode: 200, body: `{"id":"${uuid}"}`});
    });
});

function mockHandlerParams(partial: Partial<APIGatewayProxyEventV2> = {}): Parameters<APIGatewayProxyHandlerV2> {
    return [
        {...partial},
        undefined,
        undefined
    ] as unknown as Parameters<APIGatewayProxyHandlerV2>;
}


