import IServiceRepository from "./interfaces/IServiceRepository";
import Service from "../models/Service";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { Logger } from "../utils/Logger";

class ServiceRepository implements IServiceRepository {
  private dynamoClient: DynamoDBDocumentClient;

  constructor(private readonly tableName: string) {
    this.tableName = tableName;
    const client = new DynamoDBClient({});
    this.dynamoClient = DynamoDBDocumentClient.from(client);
  }

  #getPk(businessId: string): string {
    return `${businessId}#service`;
  }

  async getById(businessId: string, serviceId: string): Promise<Service | null> {
    try {
      const pk = this.#getPk(businessId);
      const sk = serviceId;

      const command = new GetCommand({
        TableName: this.tableName,
        Key: { pk, sk },
      });

      const result = await this.dynamoClient.send(command);

      if (!result.Item) {
        Logger.debug(
          `Service not found for business ${businessId} and service ${serviceId}`
        );
        return null;
      }

      Logger.debug(`Service found for business ${businessId} and service ${serviceId}`);
      Logger.debug(`Item: ${JSON.stringify(result.Item)}`);

      return new Service({
        id: result.Item.sk as string,
        name: result.Item.name as string,
        description: result.Item.description as string,
        price: result.Item.price as number,
        duration: result.Item.duration as number,
        createdAt: new Date(result.Item.createdAt as string),
        updatedAt: new Date(result.Item.updatedAt as string),
      });
    } catch (error) {
      Logger.error("Error fetching service from DynamoDB:", error);
      throw error;
    }
  }

  async getAllByBusinessId(businessId: string): Promise<Service[]> {
    try {
      const pk = this.#getPk(businessId);
      Logger.debug("pk", pk);

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

      return result.Items.map(
        item =>
          new Service({
            id: item.sk as string,
            name: item.name as string,
            description: item.description as string,
            price: item.price as number,
            duration: item.duration as number,
            createdAt: new Date(item.createdAt as string),
            updatedAt: new Date(item.updatedAt as string),
          })
      );
    } catch (error) {
      Logger.error("Error fetching services from DynamoDB:", error);
      throw error;
    }
  }
}

export default ServiceRepository;
