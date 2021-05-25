import {DynamoDBStreamHandler} from 'aws-lambda';
import {Lambda} from 'aws-sdk';
import {DynamoDBRecord} from 'aws-lambda/trigger/dynamodb-stream';

export interface RecordProcessorLambdaDependencies {
    lambda: Pick<Lambda, 'invoke'>,
    notifyFunctionArn: string;
}

export function recordProcessorLambdaFactory({lambda, notifyFunctionArn}: RecordProcessorLambdaDependencies): DynamoDBStreamHandler {
    return async ({Records}) => {
        const notifyDiscordAboutRecord = (record: DynamoDBRecord) => lambda.invoke({
            FunctionName: notifyFunctionArn,
            Payload: JSON.stringify(record)
        }).promise()
        const lambdaFunctionInvocations = Records.map(notifyDiscordAboutRecord);
        await Promise.all(lambdaFunctionInvocations);
    };
}
