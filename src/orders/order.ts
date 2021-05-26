import {UUID} from '../common/uuid';
import {ISO8601DateTimeString} from '../common/date-time';

export interface Order {
    readonly id: UUID;
    readonly createdWhen: ISO8601DateTimeString;
    readonly items: UUID[];
}
