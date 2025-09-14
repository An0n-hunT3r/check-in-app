import { DynamoDB } from "aws-sdk";
import { config } from "../config";

const dynamo = new DynamoDB({ 
  endpoint: config.dynamodb.endpoint, 
  region: config.dynamodb.region,
  accessKeyId: config.dynamodb.accessKeyId,
  secretAccessKey: config.dynamodb.secretAccessKey
});

const tables = [
  {
    TableName: 'CheckIns',
    KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
    AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
    BillingMode: "PAY_PER_REQUEST"
  },
  {
    TableName: 'Responses',
    KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
    AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
    BillingMode: "PAY_PER_REQUEST"
  }
];

async function init() {
  console.log("Initializing DynamoDB tables...");
  
  for (const table of tables) {
    try {
      await dynamo.createTable(table).promise();
      console.log(`✅ Table ${table.TableName} created`);
    } catch (err: any) {
      if (err.code === "ResourceInUseException") {
        console.log(`ℹ️  Table ${table.TableName} already exists`);
      } else {
        console.error(`❌ Error creating table ${table.TableName}:`, err);
      }
    }
  }
  
  console.log("Table initialization complete!");
}

init().catch(console.error);
