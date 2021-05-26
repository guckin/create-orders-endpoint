import {UUID} from '../../src/common/uuid';
import {Order} from '../../src/orders/order';
import {failureFrom, successFrom} from '../../src/common/result';
import {ReadOrderDependencies, ReadOrderFailure, readOrderHandlerFactory} from '../../src/orders/read-order';
import {stubOrder} from '../test-helpers/stubs';

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
