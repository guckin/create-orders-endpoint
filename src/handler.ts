import {APIGatewayProxyHandlerV2} from 'aws-lambda';
import {Json} from './utilities/json';
import {APIGatewayProxyResultV2} from 'aws-lambda/trigger/api-gateway-proxy';

interface HandlerDependencies {

}

export function createHandler({}: HandlerDependencies): APIGatewayProxyHandlerV2 {
    return async ({pathParameters}) => {
        return createResponse({
            status: 200,
            json: {
                id: pathParameters?.id
            }
        });
    }
}

interface Response {
    json: Json,
    status: number
}

function createResponse({json, status}: Response): APIGatewayProxyResultV2 {
    return {
        body: JSON.stringify(json),
        statusCode: status
    };
}
