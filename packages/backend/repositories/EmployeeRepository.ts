import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import Employee from "../models/Employee";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { IEmployeeRepository } from "./IEmployeeRepository";

export class EmployeeRepository implements IEmployeeRepository {
    private dynamoClient: DynamoDBDocumentClient;

    constructor(private readonly tableName: string) {
        this.tableName = tableName;
        const client = new DynamoDBClient({});
        this.dynamoClient = DynamoDBDocumentClient.from(client);
    }

    async getEmployeesByBusinessId(businessId: string): Promise<Employee[]> {
        try {
            const pk = `business#${businessId}#type#employee`;
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
                createdAt: new Date(item.createdAt as string),
                updatedAt: new Date(item.updatedAt as string)
            }));
        } catch (error) {
            console.error('Error fetching employees from DynamoDB:', error);
            throw error;
        }
    }
}