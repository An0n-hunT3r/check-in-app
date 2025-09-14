import { DynamoDB } from "aws-sdk";
import { randomUUID } from "crypto";
import { config } from "../config";

const dynamo = new DynamoDB.DocumentClient({ 
  endpoint: config.dynamodb.endpoint, 
  region: config.dynamodb.region,
  accessKeyId: config.dynamodb.accessKeyId,
  secretAccessKey: config.dynamodb.secretAccessKey
});

export interface ResponseAnswer {
  questionId: string;
  answer: string;
}

export interface ResponseEntry {
  id: string;
  checkInId: string;
  userId: string;
  createdAt: string;
  answers: ResponseAnswer[];
}

export const createResponse = async (response: Omit<ResponseEntry, "id">) => {
  const item: ResponseEntry = { ...response, id: randomUUID() };
  await dynamo.put({ TableName: 'Responses', Item: item }).promise();
  return item;
};

export const getAllResponses = async (): Promise<ResponseEntry[]> => {
  const data = await dynamo.scan({ TableName: 'Responses' }).promise();
  return (data.Items as ResponseEntry[]) || [];
};

export const getResponsesByCheckInId = async (checkInId: string): Promise<ResponseEntry[]> => {
  const data = await dynamo.scan({
    TableName: 'Responses',
    FilterExpression: "checkInId = :checkInId",
    ExpressionAttributeValues: { ":checkInId": checkInId }
  }).promise();
  return (data.Items as ResponseEntry[]) || [];
};

export const getResponsesByUserId = async (userId: string): Promise<ResponseEntry[]> => {
  const data = await dynamo.scan({
    TableName: 'Responses',
    FilterExpression: "userId = :userId",
    ExpressionAttributeValues: { ":userId": userId }
  }).promise();
  return (data.Items as ResponseEntry[]) || [];
};

export const getResponseByUserAndCheckIn = async (userId: string, checkInId: string): Promise<ResponseEntry | null> => {
  const data = await dynamo.scan({
    TableName: 'Responses',
    FilterExpression: "userId = :userId AND checkInId = :checkInId",
    ExpressionAttributeValues: { 
      ":userId": userId,
      ":checkInId": checkInId 
    }
  }).promise();
  return (data.Items?.[0] as ResponseEntry) || null;
};

