import {
    RecordProcessorLambdaDependencies,
    recordProcessorLambdaFactory
} from '../../src/lambda/record-processor-lambda';
import {DynamoDBStreamHandler} from 'aws-lambda';
import {DynamoDBStreamEvent} from 'aws-lambda/trigger/dynamodb-stream';

describe('Record Processor Lambda', () => {
    [
        {
            description: 'publish message to sns topic when status is updated',
            record: {
                eventName: 'MODIFY' as const,
                dynamodb: {
                    OldImage: {
                        status: {
                            S: 'CREATED'
                        }
                    },
                    NewImage: {
                        status: {
                            S: 'COMPLETE'
                        }
                    }
                }
            },
            isPublished: true,
            publishedMessage: JSON.stringify({
                eventName: 'MODIFY' as const,
                dynamodb: {
                    OldImage: {
                        status: {
                            S: 'CREATED'
                        }
                    },
                    NewImage: {
                        status: {
                            S: 'COMPLETE'
                        }
                    }
                }
            })
        },
        {
            description: 'does not publish message if the record was not an update ',
            record: {
                eventName: 'INSERT'
            } as const,
            isPublished: false,
        },
        {
            description: 'does not publish message if the updates is not an update for status',
            record: {
                eventName: 'MODIFY',
                dynamodb: {
                    NewImage: {
                        status: {
                            S: 'COMPLETE'
                        }
                    },
                    OldImage: {
                        status: {
                            S: 'COMPLETE'
                        }
                    }
                }
            } as const,
            isPublished: false,
        }
    ].forEach(({description, record, isPublished, publishedMessage}) => {
        it(description, async () => {
            const sns = getSnsMock();
            const orderStatusUpdateTopicArn = 'orderStatusUpdateTopicArn';
            const eventParams = createStubDynamoDBStreamHandlerParams({Records: [record]});

            await recordProcessorLambdaFactory({
                sns,
                orderStatusUpdateTopicArn
            })(...eventParams);

            isPublished ?
                expect(sns.publish).toBeCalledWith({
                    TopicArn: orderStatusUpdateTopicArn,
                    Message: publishedMessage
            }) :
            expect(sns.publish).not.toBeCalled();
        });
    });
});

const getSnsMock = (): RecordProcessorLambdaDependencies['sns'] => ({
    publish: jest.fn(() => ({
        promise: () => Promise.resolve()
    })) as jest.Mock
});

const createStubDynamoDBStreamHandlerParams = (event: DynamoDBStreamEvent): Parameters<DynamoDBStreamHandler> => ([
    event,
    undefined,
    undefined
] as unknown as Parameters<DynamoDBStreamHandler>);
