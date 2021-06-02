import {authorizerLambdaFactory} from '../../src/lambda/authorizer-lambda';
import {failureFrom, successFrom} from '../../src/common/result';
import {APIGatewayTokenAuthorizerEvent, APIGatewayTokenAuthorizerHandler} from 'aws-lambda';

describe('Auth', () => {

    beforeEach(() => expect.hasAssertions());

    it('returns the iam policy when the request is authorized', async () => {
        const verifyToken = jest.fn(() => Promise.resolve(successFrom(undefined)));
        const params = apiGatewayTokenAuthorizerHandlerParams({
            methodArn: 'methodArn',
            authorizationToken: 'token'
        });
        const result = await authorizerLambdaFactory({verifyToken})(...params);

        expect(result).toEqual({
            policyDocument: {
                Version: '2012-10-17',
                Statement: [{
                    Action: 'execute-api:Invoke',
                    Effect: 'Allow',
                    Resource: 'methodArn'
                }]
            },
            principalId: 'user'
        });
        expect(verifyToken).toBeCalledWith('token');
    });

    it('throws error when the request is unauthorized', async () => {
        const verifyToken = jest.fn(() => Promise.resolve(failureFrom(undefined)));
        const params = apiGatewayTokenAuthorizerHandlerParams({
            methodArn: 'methodArn',
            authorizationToken: 'token'
        });
        await expect(authorizerLambdaFactory({verifyToken})(...params)).rejects.toEqual(new Error('Unauthorized'));

        expect(verifyToken).toBeCalledWith('token');
    });

    function apiGatewayTokenAuthorizerHandlerParams(
        event: Omit<APIGatewayTokenAuthorizerEvent, 'type'>
    ): Parameters<APIGatewayTokenAuthorizerHandler> {
        return [
            event,
            undefined,
            undefined
        ] as unknown as Parameters<APIGatewayTokenAuthorizerHandler>;
    }
})
