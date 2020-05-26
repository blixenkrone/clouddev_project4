import 'source-map-support/register'
import * as AWS from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const s3 = new AWS.S3({ signatureVersion: 'v4' });
  const uploadUrl = s3.getSignedUrl('putObject', {
    Bucket: process.env.FILE_UPLOAD_S3_BUCKET,
    Key: todoId,
    Expires: 600
  })
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({ uploadUrl })
  }
}
