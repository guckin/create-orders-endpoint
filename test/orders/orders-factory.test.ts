import {UUID} from "../../src/common/uuid";
import {ISO8601DateTimeString} from '../../src/common/date-time';
import {ordersFactoryFactory} from '../../src/orders/orders-factory';
import {OrderStatus} from '../../src/orders/order';

describe('Orders Factory', () => {
    it('returns an order', () => {
        const id = '8ca080a8-7121-4b78-878d-7ec360d27925' as UUID;
        const createdWhen = '2021-05-21T15:02:02.190Z' as ISO8601DateTimeString;
        const uuid = () => id;
        const now = () => createdWhen;
        const items = [
            '641ac766-71f1-4ef7-bc01-9fbfca9117b4' as UUID,
            '61f126c8-863a-46e2-b6bc-5d0d8b9ed333' as UUID
        ];

        const result = ordersFactoryFactory({
            uuid,
            now
        })({items});

        expect(result).toEqual({
            id,
            createdWhen,
            items,
            status: OrderStatus.Created
        });
    });
});
