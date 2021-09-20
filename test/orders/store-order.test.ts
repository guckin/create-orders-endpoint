import {StoreOrderDependencies, StoreOrderFailure, storeOrderHandlerFactory} from '../../src/orders/store-order';
import {failureFrom, successFrom} from '../../src/common/result';
import {stubOrder} from '../test-helpers/stubs';

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


type DynamoMockConfig = {
    readonly fails: boolean;
};

const createDynamoMock = ({fails}: DynamoMockConfig): StoreOrderDependencies['dynamo'] => ({
    put: jest.fn(() => ({
        promise: () => fails ?
            Promise.reject() :
            Promise.resolve()
    })) as jest.Mock
});
