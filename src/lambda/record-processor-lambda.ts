import {AttributeValue, DynamoDBStreamHandler} from 'aws-lambda';
import {SNS} from 'aws-sdk';
import {DynamoDBRecord, StreamRecord} from 'aws-lambda/trigger/dynamodb-stream';
import {object, string} from 'joi';
import {OrderStatus, OrderStatuses} from '../orders/order';

export type RecordProcessorLambdaDependencies = {
    readonly sns: Pick<SNS, 'publish'>;
    readonly orderStatusUpdateTopicArn: string;
};

export const recordProcessorLambdaFactory = (
    {
         sns,
         orderStatusUpdateTopicArn
    }: RecordProcessorLambdaDependencies
): DynamoDBStreamHandler => async ({Records}) => {
    const publishRecordsForUpdateStatus = async (record: DynamoDBRecord) => {
        const payload = createDiscordMessageFromObject(record);
        console.log('📰 - Publishing Message: ', payload);
        await sns.publish({
            TopicArn: orderStatusUpdateTopicArn,
            Message: payload,
        }).promise();
    };
    const publishedEventsForUpdateStatus = Records
        .filter(isModifyStatusEvent)
        .filter(onlyStatusUpdates)
        .map(publishRecordsForUpdateStatus);
    await Promise.all(publishedEventsForUpdateStatus);
};

const onlyStatusUpdates = (
    {
        dynamodb: {
            NewImage,
            OldImage
        }
    }: ModifyStatusEvent
): boolean => NewImage.status.S !== OldImage.status.S;

const isModifyStatusEvent = (value: unknown): value is ModifyStatusEvent => {
    const imageValidations = object<{ [val: string]: AttributeValue }>({
        status: object<AttributeValue>({
            S: string().valid(...OrderStatuses)
        })
    }).unknown(true);
    const validation = object<ModifyStatusEvent>({
        eventName: string().valid('MODIFY'),
        dynamodb: object<StreamRecord>({
            OldImage: imageValidations,
            NewImage: imageValidations
        }).unknown(true)
    }).unknown(true);

    const {error} = validation.validate(value);
    return !error;
};

const createDiscordMessageFromObject = (obj: object): string => JSON.stringify(obj);

type ModifyStatusEvent = DynamoDBRecord & {
    eventName: 'MODIFY',
    dynamodb: StreamRecord & {
        OldImage: StreamRecord['OldImage'] & {
            status: {
                S: OrderStatus
            }
        },
        NewImage: StreamRecord['NewImage'] & {
            status: {
                S: OrderStatus
            }
        }
    }
};
