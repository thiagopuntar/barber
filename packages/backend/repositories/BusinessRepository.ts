import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import Business from "../models/Business";
import { IBusinessRepository } from "./IBusinessRepository";

export class BusinessRepository implements IBusinessRepository {
  private dynamoClient: DynamoDBDocumentClient;

  constructor(private readonly tableName: string) {
    const client = new DynamoDBClient({});
    this.dynamoClient = DynamoDBDocumentClient.from(client);
  }

  private getPk(): string {
    return "business";
  }

  async getBusinessById(businessId: string): Promise<Business | null> {
    try {
      const command = new GetCommand({
        TableName: this.tableName,
        Key: {
          pk: this.getPk(),
          sk: businessId,
        },
      });

      const result = await this.dynamoClient.send(command);
      if (!result.Item) {
        return null;
      }

      const business = new Business();
      business.id = result.Item.sk as string;
      business.name = result.Item.name as string;
      business.description = result.Item.description as string;
      business.image = result.Item.image as string;
      business.url = result.Item.url as string;
      business.address = result.Item.address as string;
      business.city = result.Item.city as string;
      business.state = result.Item.state as string | undefined;
      business.zip = result.Item.zip as string | undefined;
      business.country = result.Item.country as string | undefined;
      business.phone = result.Item.phone as string | undefined;
      business.email = result.Item.email as string | undefined;
      business.createdAt = new Date(result.Item.createdAt as string);
      business.updatedAt = new Date(result.Item.updatedAt as string);
      business.services = [];
      business.employees = [];

      return business;
    } catch (error) {
      console.error("Error fetching business from DynamoDB:", error);
      throw error;
    }
  }
}
