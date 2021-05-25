import {
    RecordProcessorLambdaDependencies,
    recordProcessorLambdaFactory
} from '../../src/lambda/record-processor-lambda';
import {DynamoDBStreamHandler} from 'aws-lambda';
import {DynamoDBStreamEvent} from 'aws-lambda/trigger/dynamodb-stream';

describe('Record Processor Lambda', () => {
    it('Notifies a discord channel', async () => {
        const lambda = getLambdaSdkMock();
        const notifyFunctionArn = 'notifyFunctionArn';
        const record = {
            eventName: 'INSERT'
        } as const;
        const eventParams = createStubDynamoDBStreamHandlerParams({Records: [record]});

        await recordProcessorLambdaFactory({
            lambda,
            notifyFunctionArn
        })(...eventParams);

        expect(lambda.invoke).toBeCalledWith({
            FunctionName: notifyFunctionArn,
            Payload: '{\"text\":\"```{\\\"eventName\\\":\\\"INSERT\\\"}```\"}'
        });
    });
});

function getLambdaSdkMock(): RecordProcessorLambdaDependencies['lambda'] {
    return {
        invoke: jest.fn(() => ({
            promise: () => Promise.resolve()
        })) as jest.Mock
    };
}

function createStubDynamoDBStreamHandlerParams(event: DynamoDBStreamEvent): Parameters<DynamoDBStreamHandler> {
    return [
        event,
        undefined,
        undefined
    ] as unknown as Parameters<DynamoDBStreamHandler>;
}
