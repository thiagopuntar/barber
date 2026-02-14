import IServiceRepository from "./IServiceRepository";
import Service from "../models/Service";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

class ServiceRepository implements IServiceRepository {
  private dynamoClient: DynamoDBDocumentClient;
  private tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
    const client = new DynamoDBClient({});
    this.dynamoClient = DynamoDBDocumentClient.from(client);
  }

  private getPk(businessId: string): string {
    return `${businessId}#service`;
  }

  async getServiceById(businessId: string, serviceId: string): Promise<Service> {
    try {
      const pk = this.getPk(businessId);
      const sk = serviceId;

      const command = new GetCommand({
        TableName: this.tableName,
        Key: { pk, sk },
      });

      const result = await this.dynamoClient.send(command);

      if (!result.Item) {
        throw new Error("Service not found");
      }

      const service = new Service();
      service.id = result.Item.sk as string;
      service.name = result.Item.name as string;
      service.description = result.Item.description as string;
      service.price = result.Item.price as number;
      service.duration = result.Item.duration as number;
      service.createdAt = new Date(result.Item.createdAt as string);
      service.updatedAt = new Date(result.Item.updatedAt as string);

      return service;
    } catch (error) {
      console.error("Error fetching service from DynamoDB:", error);
      throw error;
    }
  }

  async getServicesByBusinessId(businessId: string): Promise<Service[]> {
    try {
      const pk = this.getPk(businessId);
      console.debug("pk", pk);

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

      return result.Items.map(item => ({
        id: item.sk as string,
        name: item.name as string,
        description: item.description as string,
        price: item.price as number,
        duration: item.duration as number,
        createdAt: new Date(item.createdAt as string),
        updatedAt: new Date(item.updatedAt as string),
      }));
    } catch (error) {
      console.error("Error fetching services from DynamoDB:", error);
      throw error;
    }
  }
}

export default ServiceRepository;
