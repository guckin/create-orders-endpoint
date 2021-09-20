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

export function authorizerLambdaFactory({verifyToken}: AuthorizerLambdaDependencies): APIGatewayTokenAuthorizerHandler {
    return async ({methodArn, authorizationToken}: APIGatewayTokenAuthorizerEvent) => {
        const result = await verifyToken(authorizationToken);
        return isSuccess(result) ?
            createPolicyForFunctionInvoke({principalId: 'user', resourceArn: methodArn}) :
            unauthorized();
    };
}

function createPolicyForFunctionInvoke({principalId, resourceArn}: Policy): APIGatewayAuthorizerResult {
    return {
        policyDocument: {
            Version: '2012-10-17',
            Statement: [{
                Action: 'execute-api:Invoke',
                Effect: 'Allow',
                Resource: resourceArn
            }]
        },
        principalId
    };
}

function unauthorized(): never {
    throw new Error('Unauthorized');
}

type Policy = {
    readonly principalId: string;
    readonly resourceArn: string;
};
