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

export function errorOrdersIdInvalid(id: unknown): APIGatewayProxyResultV2 {
    return createResponse({
        status: 400,
        json: {
            message: 'Order id is invalid. Id must be a UUID',
            invalidID: id
        }
    });
}

export function errorPayloadIsInvalid(payload: Json): APIGatewayProxyResultV2 {
    return createResponse({
        status: 400,
        json: {
            message: 'Payload is invalid',
            invalidPayload: payload,
        }
    });
}

export function errorPayloadIsNotJson(payload: unknown): APIGatewayProxyResultV2 {
    return createResponse({
        status: 400,
        json: {
            message: 'Payload contains invalid json',
            invalidPayload: payload,
        }
    });
}

export function errorOrderNotFound(): APIGatewayProxyResultV2 {
    return createResponse({
        status: 404,
        json: {
            message: 'Not Found'
        }
    });
}

