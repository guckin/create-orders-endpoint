import {handler} from '../src/lambda';
import {APIGatewayProxyEventV2, APIGatewayProxyHandlerV2} from 'aws-lambda';

describe('handler', () => {
    it('returns the query params and path parameters`', async () => {
        // const uuid = v4();
        // const params = mockHandlerParams({pathParameters: {id: uuid}});
        //
        // const result = await handler(...params);
        //
        // expect(result).toEqual({statusCode: 200, body: `{"id":"${uuid}"}`});
    });
});

function stubHandlerParams(partial: Partial<APIGatewayProxyEventV2> = {}): Parameters<APIGatewayProxyHandlerV2> {
    return [
        {...partial},
        undefined,
        undefined
    ] as unknown as Parameters<APIGatewayProxyHandlerV2>;
}


