import {APIGatewayProxyEventV2, APIGatewayProxyHandlerV2} from 'aws-lambda';

export function stubHandlerParams(partial: Partial<APIGatewayProxyEventV2> = {}): Parameters<APIGatewayProxyHandlerV2> {
    return [
        {...partial},
        undefined,
        undefined
    ] as unknown as Parameters<APIGatewayProxyHandlerV2>;
}
