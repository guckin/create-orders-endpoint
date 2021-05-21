import {UUID} from '../../src/common/uuid';
import {Order} from '../../src/orders/order';
import {StoreOrderDependencies, StoreOrderFailure, storeOrderHandlerFactory} from '../../src/orders/store-order';
import {ISO8601DateTimeString} from '../../src/common/date-time';
import {failureFrom, successFrom} from '../../src/common/result';

describe('Store Order', () => {

    beforeEach(() => expect.hasAssertions());

    it('stores an order in dynamo', async () => {
        const dynamo = createDynamoMock({fails: false});
        const tableName = 'tableName';
        const order = stubOrder();

        const result = await storeOrderHandlerFactory({
            dynamo,
            tableName
        })(order);

        expect(result).toEqual(successFrom(undefined));
    });

    it('returns a failure when dynamo fails', async () => {
        const dynamo = createDynamoMock({fails: true});
        const tableName = 'tableName';
        const order = stubOrder();

        const result = await storeOrderHandlerFactory({
            dynamo,
            tableName
        })(order);

        expect(result).toEqual(failureFrom(StoreOrderFailure.Unknown));
    });
});


interface DynamoMockConfig {
    fails: boolean;
}

function createDynamoMock({fails}: DynamoMockConfig): StoreOrderDependencies['dynamo'] {
    return {
        put: jest.fn(() => ({
            promise: () => fails ?
                Promise.reject() :
                Promise.resolve()
        })) as jest.Mock
    };
}

function stubOrder(order: Partial<Order> = {}): Order {
    return {
        createdWhen: '2021-05-21T15:02:02.190Z' as ISO8601DateTimeString,
        id: '40fede5c-b775-43ef-8cf0-a747288cfe8b' as UUID,
        items: [
            '62284f54-6a4b-4a4a-b2c1-0597cc0fc1e2' as UUID
        ],
        ...order
    };
}
