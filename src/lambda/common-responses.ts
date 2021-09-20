import {APIGatewayProxyResultV2} from 'aws-lambda/trigger/api-gateway-proxy';
import {Json} from '../common/json';

export const errorInternalServerError = (): APIGatewayProxyResultV2 => createResponse({
    status: 500,
    json: {
        message: 'Internal Server Error',
    }
});

export type Response = {
    readonly json: Json;
    readonly status: number;
};

export const createResponse = ({json, status}: Response): APIGatewayProxyResultV2 => ({
    body: JSON.stringify(json),
    statusCode: status
});

export const errorOrdersIdInvalid = (id: unknown): APIGatewayProxyResultV2 => createResponse({
    status: 400,
    json: {
        message: 'Order id is invalid. Id must be a UUID',
        invalidID: id
    }
});

export const errorPayloadIsInvalid = (payload: Json): APIGatewayProxyResultV2 => createResponse({
    status: 400,
    json: {
        message: 'Payload is invalid',
        invalidPayload: payload,
    }
});

export const errorPayloadIsNotJson = (payload: unknown): APIGatewayProxyResultV2 => createResponse({
    status: 400,
    json: {
        message: 'Payload contains invalid json',
        invalidPayload: payload,
    }
});

export const errorOrderNotFound = (): APIGatewayProxyResultV2 => createResponse({
    status: 404,
    json: {
        message: 'Not Found'
    }
});

