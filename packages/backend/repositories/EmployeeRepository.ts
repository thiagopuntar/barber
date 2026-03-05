import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import Employee, { Availability } from "../models/Employee";
import { DynamoDBDocumentClient, GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { IEmployeeRepository } from "./IEmployeeRepository";
import { Logger } from "../utils/Logger";

export class EmployeeRepository implements IEmployeeRepository {
  private dynamoClient: DynamoDBDocumentClient;

  constructor(private readonly tableName: string) {
    this.tableName = tableName;
    const client = new DynamoDBClient({});
    this.dynamoClient = DynamoDBDocumentClient.from(client);
  }

  #getPk(businessId: string): string {
    return `${businessId}#employee`;
  }

  async getAllByBusinessId(businessId: string): Promise<Employee[]> {
    try {
      const pk = this.#getPk(businessId);

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

      return result.Items.map(item => {
        const employee = new Employee({
          id: item.sk as string,
          name: item.name as string,
          createdAt: new Date(item.createdAt as string),
          updatedAt: new Date(item.updatedAt as string)
        });
        employee.addAvailability(...(item.availability as Availability[]));
        return employee;
      });
    } catch (error) {
      Logger.error("Error fetching employees from DynamoDB:", error);
      throw error;
    }
  }

  async getById(businessId: string, employeeId: string): Promise<Employee> {
    try {
      const pk = this.#getPk(businessId);
      const sk = employeeId;
      Logger.debug(`Getting employee by id ${employeeId} for business ${businessId}`);
      Logger.debug(`pk: ${pk}`);
      Logger.debug(`sk: ${sk}`);

      const command = new GetCommand({
        TableName: this.tableName,
        Key: { pk: pk, sk: sk },
      });

      const result = await this.dynamoClient.send(command);

      if (!result.Item) {
        Logger.info(`Employee not found for business ${businessId} and employee ${employeeId}`);
        throw new Error("Employee not found");
      }

      Logger.debug(`Employee found for business ${businessId} and employee ${employeeId}`);
      Logger.debug(`Item: ${JSON.stringify(result.Item)}`);

      const employee = new Employee({
        id: result.Item.sk as string,
        name: result.Item.name as string,
        createdAt: new Date(result.Item.createdAt as string),
        updatedAt: new Date(result.Item.updatedAt as string)
      });
      employee.addAvailability(...(result.Item.availability as Availability[]));
      return employee;
    } catch (error) {
      Logger.error("Error fetching employee from DynamoDB:", error);
      throw error;
    }
  }
}
