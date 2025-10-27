import IServiceRepository from "./IServiceRepository";
import Service from "../models/Service";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

class ServiceRepository implements IServiceRepository {
    private dynamoClient: DynamoDBDocumentClient;
    private tableName: string;

    constructor(tableName: string) {
        this.tableName = tableName;
        const client = new DynamoDBClient({});
        this.dynamoClient = DynamoDBDocumentClient.from(client);
    }

    async getServicesByBusinessId(businessId: string): Promise<Service[]> {
        try {
            const pk = `business#${businessId}#type#service`;
            console.debug('pk', pk);

            const command = new QueryCommand({
                TableName: this.tableName,
                KeyConditionExpression: 'pk = :pk',
                ExpressionAttributeValues: {
                    ':pk': pk,
                }
            });

            const result = await this.dynamoClient.send(command);

            if (!result.Items) {
                return [];
            }

            return result.Items.map(item => ({
                id: item.sk.split('#')[1] as string,
                name: item.name as string,
                description: item.description as string,
                price: item.price as number,
                duration: item.duration as number,
                createdAt: new Date(item.createdAt as string),
                updatedAt: new Date(item.updatedAt as string)
            }));
        } catch (error) {
            console.error('Error fetching services from DynamoDB:', error);
            throw error;
        }
    }
}

export default ServiceRepository;