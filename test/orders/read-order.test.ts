import {UUID} from '../../src/common/uuid';
import {Order} from '../../src/orders/order';
import {ISO8601DateTimeString} from '../../src/common/date-time';
import {failureFrom, successFrom} from '../../src/common/result';
import {ReadOrderDependencies, ReadOrderFailure, readOrderHandlerFactory} from '../../src/orders/read-order';

describe('Read Order', () => {

    beforeEach(() => expect.hasAssertions());

    it('reads orders in dynamo', async () => {
        const order = stubOrder();
        const dynamo = createDynamoMock({fails: false, order});
        const tableName = 'tableName';

        const result = await readOrderHandlerFactory({
            dynamo,
            tableName
        })('someID' as UUID);

        expect(result).toEqual(successFrom(order));
    });

    it('returns a failure when read fails', async () => {
        const dynamo = createDynamoMock({fails: true});
        const tableName = 'tableName';

        const result = await readOrderHandlerFactory({
            dynamo,
            tableName
        })('someID' as UUID);

        expect(result).toEqual(failureFrom(ReadOrderFailure.Unknown));
    });

    it('returns error when no record is found', async () => {
        const dynamo = createDynamoMock({fails: false, order: undefined});
        const tableName = 'tableName';

        const result = await readOrderHandlerFactory({
            dynamo,
            tableName
        })('someID' as UUID);

        expect(result).toEqual(failureFrom(ReadOrderFailure.NotFound));
    });
});


interface DynamoMockConfigSuccess {
    fails: false;
    order: Order | undefined;
}

interface DynamoMockConfigFailure {
    fails: true;
}

type DynamoMockConfig = DynamoMockConfigSuccess | DynamoMockConfigFailure;

function createDynamoMock(config: DynamoMockConfig): ReadOrderDependencies['dynamo'] {
    return {
        get: jest.fn(() => ({
            promise: () => config.fails ?
                Promise.reject() :
                Promise.resolve({Item: config.order})
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
