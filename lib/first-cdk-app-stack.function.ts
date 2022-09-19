import * as AWSXRay from 'aws-xray-sdk';
import * as AWSSDK from 'aws-sdk';
import { APIGatewayProxyEvent } from "aws-lambda";

//define DocumentClient
const AWS = AWSXRay.captureAWS(AWSSDK);
const docClient = new AWS.DynamoDB.DocumentClient();

//define table by variable passed from stack
const table = process.env.DYNAMODB || "undefined"

//define table in params
const params = {
  TableName : table
}

//scanItems function uses params to scan a dynamodb table
async function scanItems(){
  try {
    const data = await docClient.scan(params).promise()
    return data
  } catch (err) {
    return err
  }
}

//actual handler logs events and calls scanItems
//logs error on catch
exports.handler = async (event:APIGatewayProxyEvent) => {
  try {
    console.log(event)
    const data = await scanItems()
    return { body: JSON.stringify(data) }
  } catch (err) {
    return { error: err }
  }
}