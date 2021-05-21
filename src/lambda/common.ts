import {APIGatewayProxyResultV2} from 'aws-lambda/trigger/api-gateway-proxy';
import {Json} from '../common/json';

export function errorInternalServerError(): APIGatewayProxyResultV2 {
    return createResponse({
        status: 500,
        json: {
            message: 'Internal Server Error',
        }
    });
}

export interface Response {
    readonly json: Json,
    readonly status: number
}

export function createResponse({json, status}: Response): APIGatewayProxyResultV2 {
    return {
        body: JSON.stringify(json),
        statusCode: status
    };
}

