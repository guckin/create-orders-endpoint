import {APIGatewayProxyHandlerV2} from 'aws-lambda';
import {Json, parseJson} from '../common/json';
import {APIGatewayProxyResultV2} from 'aws-lambda/trigger/api-gateway-proxy';
import {StoreOrderHandler} from '../orders/store-order';
import {MutableOrderField, Order} from '../orders/order';
import {object, string, array} from 'joi';
import {isSuccess} from '../common/result';
import {UUID} from '../common/uuid';
import {ISO8601DateTimeString} from '../common/date-time';
import {createResponse, errorInternalServerError} from './common';

export interface PostOrderLambdaDependencies {
    readonly storeOrder: StoreOrderHandler;
    readonly uuid: () => UUID;
    readonly now: () => ISO8601DateTimeString;
}

export function postOrderLambdaFactory({storeOrder, uuid, now}: PostOrderLambdaDependencies): APIGatewayProxyHandlerV2 {
    return async ({body}) => {
        const result = parseJson(body)
        if (!isSuccess(result)) return errorPayloadIsNotJson(body);
        if (!isCreateOrderPayload(result.value)) return errorPayloadIsInvalid(result.value);
        const order: Order = {
            id: uuid(),
            createdWhen: now(),
            ...result.value
        };
        const createOrderResult = await storeOrder(order);
        if(!isSuccess(createOrderResult)) return errorInternalServerError();
        return successfullyCreatedOrder(order);
    }
}

function successfullyCreatedOrder(order: Order): APIGatewayProxyResultV2 {
    return createResponse({
        status: 201,
        json: order
    });
}

function errorPayloadIsNotJson(payload: unknown): APIGatewayProxyResultV2 {
    return createResponse({
        status: 400,
        json: {
            message: 'Payload contains invalid json',
            invalidPayload: payload,
        }
    });
}

function errorPayloadIsInvalid(payload: Json): APIGatewayProxyResultV2 {
    return createResponse({
        status: 400,
        json: {
            message: 'Payload is invalid',
            invalidPayload: payload,
            exampleValidPayload: {
                items: [
                    '12594a47-bacd-408c-bded-0784ced16f7b'
                ]
            }
        }
    });
}

type CreateOrderPayload = Pick<Order, MutableOrderField>;

function isCreateOrderPayload(payload: unknown): payload is CreateOrderPayload {
    const validation = object({
        items: array().items(string().uuid()).required()
    });
    const {error} = validation.validate(payload);
    return !error;
}
