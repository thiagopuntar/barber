import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import Employee from "../models/Employee";
import { DynamoDBDocumentClient, GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
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

            return result.Items.map(item => {
                const employee = new Employee();
                employee.id = item.sk.split('#')[1] as string;
                employee.name = item.name as string;
                employee.createdAt = new Date(item.createdAt as string);
                employee.updatedAt = new Date(item.updatedAt as string);
                return employee;
            });
        } catch (error) {
            console.error('Error fetching employees from DynamoDB:', error);
            throw error;
        }
    }

    async getEmployee(businessId: string, employeeId: string): Promise<Employee> {
        try {
            const pk = `business#${businessId}#type#employee`;
            const sk = employeeId;

            const command = new GetCommand({
                TableName: this.tableName,
                Key: { pk: pk, sk: sk }
            });

            const result = await this.dynamoClient.send(command);

            if (!result.Item) {
                throw new Error('Employee not found');
            }

            const employee = new Employee();
            employee.id = result.Item.sk as string;
            employee.name = result.Item.name as string;
            employee.createdAt = new Date(result.Item.createdAt as string);
            employee.updatedAt = new Date(result.Item.updatedAt as string);
            return employee;
        }
        catch (error) {
            console.error('Error fetching employee from DynamoDB:', error);
            throw error;
        }
    }
}