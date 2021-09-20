import {
    APIGatewayAuthorizerResult,
    APIGatewayTokenAuthorizerEvent,
    APIGatewayTokenAuthorizerHandler
} from 'aws-lambda';
import {TokenVerification} from '../auth/token-verification';
import {isSuccess} from '../common/result';

export type AuthorizerLambdaDependencies = {
    readonly verifyToken: TokenVerification;
};

export const authorizerLambdaFactory = (
    {
        verifyToken
    }: AuthorizerLambdaDependencies
): APIGatewayTokenAuthorizerHandler => async ({methodArn, authorizationToken}: APIGatewayTokenAuthorizerEvent) => {
    const result = await verifyToken(authorizationToken);
    return isSuccess(result) ?
        createPolicyForFunctionInvoke({principalId: 'user', resourceArn: methodArn}) :
        unauthorized();
};

const createPolicyForFunctionInvoke = ({principalId, resourceArn}: Policy): APIGatewayAuthorizerResult => ({
    policyDocument: {
        Version: '2012-10-17',
        Statement: [{
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: resourceArn
        }]
    },
    principalId
});

const unauthorized = (): never => {
    throw new Error('Unauthorized');
};

type Policy = {
    readonly principalId: string;
    readonly resourceArn: string;
};
