import {APIGatewayProxyHandlerV2} from 'aws-lambda';
import {APIGatewayProxyResultV2} from 'aws-lambda/trigger/api-gateway-proxy';
import {ReadOrderFailure, ReadOrderHandler} from '../orders/read-order';
import {Order} from '../orders/order';
import {isSuccess} from '../common/result';
import {isUUID} from '../common/uuid';
import {createResponse, errorInternalServerError, errorOrderNotFound, errorOrdersIdInvalid} from './common-responses';

export interface GetOrderLambdaDependencies {
    readonly readOrder: ReadOrderHandler;
}

export function getOrderLambdaFactory({readOrder}: GetOrderLambdaDependencies): APIGatewayProxyHandlerV2 {
    return async ({pathParameters}) => {
        const id = pathParameters?.id;
        if(!isUUID(id)) return errorOrdersIdInvalid(id);
        const readOrderResult = await readOrder(id);
        if(!isSuccess(readOrderResult)) return errorFailureRetrievingOrder(readOrderResult.error);
        return successfullyRetrievedOrder(readOrderResult.value);
    }
}

function successfullyRetrievedOrder(order: Order): APIGatewayProxyResultV2 {
    return createResponse({
        json: order,
        status: 200
    });
}

function errorFailureRetrievingOrder(failure: ReadOrderFailure): APIGatewayProxyResultV2 {
    return {
        [ReadOrderFailure.NotFound]: () => errorOrderNotFound(),
        [ReadOrderFailure.Unknown]: () => errorInternalServerError()
    }[failure]();
}
