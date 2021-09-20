import {APIGatewayProxyHandlerV2} from 'aws-lambda';
import {parseJson} from '../common/json';
import {APIGatewayProxyResultV2} from 'aws-lambda/trigger/api-gateway-proxy';
import {StoreOrderHandler} from '../orders/store-order';
import {Order} from '../orders/order';
import {object, string, array} from 'joi';
import {isSuccess} from '../common/result';
import {createResponse, errorInternalServerError, errorPayloadIsInvalid, errorPayloadIsNotJson} from './common-responses';
import {OrdersFactory} from '../orders/orders-factory';

export type PostOrderLambdaDependencies = {
    readonly storeOrder: StoreOrderHandler;
    readonly ordersFactory: OrdersFactory;
};

export function postOrderLambdaFactory({storeOrder, ordersFactory}: PostOrderLambdaDependencies): APIGatewayProxyHandlerV2 {
    return async ({body}) => {
        const result = parseJson(body)
        if (!isSuccess(result)) return errorPayloadIsNotJson(body);
        if (!isCreateOrderPayload(result.value)) return errorPayloadIsInvalid(result.value);
        const order = ordersFactory(result.value);
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

type CreateOrderPayload = Pick<Order, 'items'>;

function isCreateOrderPayload(payload: unknown): payload is CreateOrderPayload {
    const validation = object({
        items: array().items(string().uuid()).required()
    });
    const {error} = validation.validate(payload);
    return !error;
}
