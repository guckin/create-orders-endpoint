import {DynamoDBStreamHandler} from 'aws-lambda';
import {Lambda} from 'aws-sdk';
import {DynamoDBRecord} from 'aws-lambda/trigger/dynamodb-stream';

export interface RecordProcessorLambdaDependencies {
    lambda: Pick<Lambda, 'invoke'>,
    notifyFunctionArn: string;
}

export function recordProcessorLambdaFactory({lambda, notifyFunctionArn}: RecordProcessorLambdaDependencies): DynamoDBStreamHandler {
    return async ({Records}) => {
        const notifyDiscordAboutRecord = async (record: DynamoDBRecord) => {
            const payload = createDiscordMessageFromObject(record);
            console.log('✉️ Sending notification to discord: ', payload);
            await lambda.invoke({
                FunctionName: notifyFunctionArn,
                Payload: payload
            }).promise();
        }
        const lambdaFunctionInvocations = Records.map(notifyDiscordAboutRecord);
        await Promise.all(lambdaFunctionInvocations);
    };
}



function createDiscordMessageFromObject(obj: object): string {
    const messageText = `\`\`\`${JSON.stringify(obj)}\`\`\``.replace('"', '\"');
    return JSON.stringify({text: messageText});
}
