import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserIdFromJwt } from '../../auth/utils'
import { createLogger } from '../../utils/logger'
const logger = createLogger('http')
import { DynamoDB } from 'aws-sdk';
const docClient = new DynamoDB.DocumentClient();

const TODO_TABLE = process.env.TODO_TABLE
const INDEX_NAME = process.env.INDEX_NAME

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  try {
    const userId = getUserIdFromJwt(event);
    const params = {
      TableName: TODO_TABLE,
      IndexName: INDEX_NAME,
      FilterExpression: 'userId=:u',
      ExpressionAttributeValues: { ':u': userId }
    };

    logger.info(`userid: ${userId}`);
    const result = await docClient.scan(params).promise();
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ items: result.Items })
    }
  }
  catch (e) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: e.message
    }
  }
}
