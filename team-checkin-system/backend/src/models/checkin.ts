import { DynamoDB } from "aws-sdk";
import { randomUUID } from "crypto";
import { config } from "../config";

const dynamo = new DynamoDB.DocumentClient({ 
  endpoint: config.dynamodb.endpoint, 
  region: config.dynamodb.region,
  accessKeyId: config.dynamodb.accessKeyId,
  secretAccessKey: config.dynamodb.secretAccessKey
});

export interface Question {
  id: string;
  text: string;
}

export interface CheckIn {
  id: string;
  title: string;
  dueDate: string;
  createdBy: string;
  createdAt: string;
  questions: Question[];
}

export const createCheckIn = async (checkin: Omit<CheckIn, "id">) => {
  const item: CheckIn = { ...checkin, id: randomUUID() };
  await dynamo.put({ TableName: 'CheckIns', Item: item }).promise();
  return item;
};

export const getAllCheckIns = async (): Promise<CheckIn[]> => {
  const data = await dynamo.scan({ TableName: 'CheckIns' }).promise();
  return (data.Items as CheckIn[]) || [];
};

export const getCheckInById = async (id: string): Promise<CheckIn | null> => {
  const data = await dynamo.get({ 
    TableName: 'CheckIns', 
    Key: { id } 
  }).promise();
  return (data.Item as CheckIn) || null;
};

