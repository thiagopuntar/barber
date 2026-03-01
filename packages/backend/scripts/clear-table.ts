#!/usr/bin/env ts-node

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, BatchWriteCommand } from "@aws-sdk/lib-dynamodb";

async function clearTable(tableName: string) {
  const client = new DynamoDBClient({
    region: process.env.AWS_REGION || "us-east-1",
  });
  const dynamoClient = DynamoDBDocumentClient.from(client);

  console.log(`🧹 Clearing table: ${tableName}`);

  try {
    let lastEvaluatedKey: Record<string, any> | undefined = undefined;
    let totalDeleted = 0;

    do {
      // 1. Scan for items (only need keys)
      const scanCommand: ScanCommand = new ScanCommand({
        TableName: tableName,
        ProjectionExpression: "pk, sk",
        ExclusiveStartKey: lastEvaluatedKey,
      });

      const scanResult = await dynamoClient.send(scanCommand);
      const items = scanResult.Items || [];

      if (items.length === 0) {
        break;
      }

      // 2. Batch delete items in chunks of 25
      for (let i = 0; i < items.length; i += 25) {
        const chunk = items.slice(i, i + 25);
        const deleteRequests = chunk.map(item => ({
          DeleteRequest: {
            Key: {
              pk: item.pk,
              sk: item.sk,
            },
          },
        }));

        const batchWriteCommand = new BatchWriteCommand({
          RequestItems: {
            [tableName]: deleteRequests,
          },
        });

        await dynamoClient.send(batchWriteCommand);
        totalDeleted += chunk.length;
        process.stdout.write(`\rDeleted ${totalDeleted} items...`);
      }

      lastEvaluatedKey = scanResult.LastEvaluatedKey;
    } while (lastEvaluatedKey);

    console.log(`\n✅ Successfully cleared ${totalDeleted} items from ${tableName}`);
  } catch (error) {
    console.error(`\n❌ Error clearing table ${tableName}:`, error);
    throw error;
  }
}

async function main() {
  const tableName = process.env.APPOINTMENT_TABLE_NAME || "AppointmentTable";

  // Optional: check for table name in arguments
  const args = process.argv.slice(2);
  const targetTable = args[0] || tableName;

  try {
    await clearTable(targetTable);
  } catch (error) {
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { clearTable };
