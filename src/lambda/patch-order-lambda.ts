import {APIGatewayProxyHandlerV2} from 'aws-lambda';
import {array, object, ObjectSchema, string} from 'joi';
import {Order, OrderStatus, OrderStatuses} from '../orders/order';
import {isUUID} from '../common/uuid';
import {
    createResponse,
    errorInternalServerError,
    errorOrderNotFound,
    errorOrdersIdInvalid,
    errorPayloadIsInvalid,
    errorPayloadIsNotJson
} from './common-responses';
import {parseJson} from '../common/json';
import {isSuccess} from '../common/result';
import {OrderUpdate, UpdateOrderFailure, UpdateOrderHandler} from '../orders/update-order';
import {APIGatewayProxyResultV2} from 'aws-lambda/trigger/api-gateway-proxy';

export interface PatchOrderLambdaDependencies {
    updateOrder: UpdateOrderHandler;
}

export function patchOrderLambdaFactory({updateOrder}: PatchOrderLambdaDependencies): APIGatewayProxyHandlerV2 {
    return async ({pathParameters, body}) => {
        const id = pathParameters?.id;
        if(!isUUID(id)) return errorOrdersIdInvalid(id);
        const jsonParseResult = parseJson(body)
        if (!isSuccess(jsonParseResult)) return errorPayloadIsNotJson(body);
        if (!payloadIsValid(jsonParseResult.value)) return errorPayloadIsInvalid(jsonParseResult.value);
        const updates = jsonParseResult.value.changes.map(deserializeOrderUpdate);
        const updateResult = await updateOrder(id, updates);
        if (!isSuccess(updateResult)) return errorFailureUpdatingOrder(updateResult.error)
        return successfullyUpdatedOrder(updateResult.value);
    };
}

export interface UpdateOrderPayload {
    changes: OrderPatchJson[]
}

export type OrderPatchJson = OrderStatusReplacePatchJson;

export interface OrderStatusReplacePatchJson {
    op: 'replace';
    path: '/status';
    value: OrderStatus;
}

const orderStatusReplaceValidation: ObjectSchema<OrderStatusReplacePatchJson> = object({
    op: string().valid('replace').required(),
    path: string().valid('/status').required(),
    value: string().valid(...OrderStatuses).required()
});

function payloadIsValid(value: unknown): value is UpdateOrderPayload {
    const validation = object({
        changes: array().items(
            orderStatusReplaceValidation
        ).unique((a, b) => a.path === b.path).required()
    });
    const {error} = validation.validate(value);
    return !error;
}

function errorFailureUpdatingOrder(failure: UpdateOrderFailure): APIGatewayProxyResultV2 {
    return {
        [UpdateOrderFailure.ItemNotFound]: () => errorOrderNotFound(),
        [UpdateOrderFailure.UnknownFailure]: () => errorInternalServerError()
    }[failure]();
}

function deserializeOrderUpdate({value}: OrderPatchJson): OrderUpdate {
    return {
        field: 'status',
        value
    };
}

function successfullyUpdatedOrder(order: Order): APIGatewayProxyResultV2 {
    return createResponse({
        json: order,
        status: 200
    });
}
