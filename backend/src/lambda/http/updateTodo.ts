import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { createLogger } from '../../utils/logger'
const logger = createLogger('updateTodo')
import { DynamoDB } from 'aws-sdk';
const docClient = new DynamoDB.DocumentClient();

// const REGION = process.env.REGION;
const TODO_TABLE = process.env.TODO_TABLE
const FILE_UPLOAD_S3_BUCKET = process.env.FILE_UPLOAD_S3_BUCKET

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Entered update handler')
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  try {
    const getTodo = await docClient.get({ TableName: TODO_TABLE, Key: { todoId } }).promise();
    const currentTodo = getTodo.Item;
    const attachmentUrl = `https://${FILE_UPLOAD_S3_BUCKET}.s3.eu-west-1.amazonaws.com/${todoId.trim()}`
    const newTodo = { ...currentTodo, ...updatedTodo, attachmentUrl };
    logger.info('NEW todo', { newTodo });
    const params = {
      TableName: TODO_TABLE,
      Key: { todoId },
      UpdateExpression: 'set attachmentUrl = :u, dueDate = :due, done = :done',
      ExpressionAttributeValues: {
        ':u': newTodo.attachmentUrl,
        ':due': newTodo.dueDate,
        ':done': newTodo.done
      }
    };
    await docClient.update(params).promise();
    logger.info('Success updating TODO');
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: ''
    }
  }
  catch (e) {
    logger.error('Error updating TODO', { e });
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: e.message
    }
  }

}
