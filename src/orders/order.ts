import {UUID} from '../common/uuid';
import {ISO8601DateTimeString} from '../common/date-time';

export interface Order {
    id: UUID;
    createdWhen: ISO8601DateTimeString;
    items: UUID[];
}

export type MutableOrderField = 'items';
