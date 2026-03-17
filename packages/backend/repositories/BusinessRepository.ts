import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import Business from "../models/Business";
import { IBusinessRepository } from "./interfaces/IBusinessRepository";
import { Logger } from "../utils/Logger";

export class BusinessRepository implements IBusinessRepository {
  private dynamoClient: DynamoDBDocumentClient;

  constructor(private readonly tableName: string) {
    const client = new DynamoDBClient({});
    this.dynamoClient = DynamoDBDocumentClient.from(client);
  }

  #getPk(): string {
    return "business";
  }

  async getById(businessId: string): Promise<Business | null> {
    try {
      const command = new GetCommand({
        TableName: this.tableName,
        Key: {
          pk: this.#getPk(),
          sk: businessId,
        },
      });

      const result = await this.dynamoClient.send(command);
      if (!result.Item) {
        return null;
      }

      const business = new Business({
        id: result.Item.sk as string,
        name: result.Item.name as string,
        description: result.Item.description as string,
        image: result.Item.image as string,
        url: result.Item.url as string,
        address: result.Item.address as string,
        city: result.Item.city as string,
        state: result.Item.state as string | undefined,
        zip: result.Item.zip as string | undefined,
        country: result.Item.country as string | undefined,
        phone: result.Item.phone as string | undefined,
        email: result.Item.email as string | undefined,
        createdAt: new Date(result.Item.createdAt as string),
        updatedAt: new Date(result.Item.updatedAt as string),
      });

      return business;
    } catch (error) {
      Logger.error("Error fetching business from DynamoDB:", error);
      throw error;
    }
  }

  async getAll(): Promise<Business[]> {
    try {
      const pk = this.#getPk();

      const command = new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: "pk = :pk",
        ExpressionAttributeValues: {
          ":pk": pk,
        },
      });

      const result = await this.dynamoClient.send(command);

      if (!result.Items) {
        return [];
      }

      return result.Items.map((item: any) => {
        return new Business({
          id: item.sk as string,
          name: item.name as string,
          description: item.description as string,
          image: item.image as string,
          url: item.url as string,
          address: item.address as string,
          city: item.city as string,
          state: item.state as string | undefined,
          zip: item.zip as string | undefined,
          country: item.country as string | undefined,
          phone: item.phone as string | undefined,
          email: item.email as string | undefined,
          createdAt: new Date(item.createdAt as string),
          updatedAt: new Date(item.updatedAt as string),
        });
      });
    } catch (error) {
      Logger.error("Error fetching businesses from DynamoDB:", error);
      throw error;
    }
  }
}
