import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import IAppointmentRepository from "./IAppointmentRepository";
import Appointment from "../models/Appointment";

class AppointmentRepository implements IAppointmentRepository {
    private dynamoClient: DynamoDBDocumentClient;
    private tableName: string;

    constructor(tableName: string) {
        this.tableName = tableName;
        const client = new DynamoDBClient({});
        this.dynamoClient = DynamoDBDocumentClient.from(client);
    }

    async getAppointmentsByEmployeeIdAndDate(businessId: string, employeeId: string, date: Date): Promise<Appointment[]> {
        try {
            const pk = `business#${businessId}#type#appointment`;
            console.debug('pk', pk);

            const sk = `employee#${employeeId}#date#${date.toISOString().split('T')[0]}`;
            console.debug('sk', sk);

            const command = new QueryCommand({
                TableName: this.tableName,
                KeyConditionExpression: 'pk = :pk and sk = begins_with(:sk)',
                ExpressionAttributeValues: {
                    ':pk': pk,
                    ':sk': sk,
                }
            });

            const result = await this.dynamoClient.send(command);

            if (!result.Items) {
                return [];
            }

            return result.Items.map(item => ({
                id: item.id as string,
                date: new Date(item.date as string),
                initialTime: item.initialTime as string,
                finalTime: item.finalTime as string,
                createdAt: new Date(item.createdAt as string),
                updatedAt: new Date(item.updatedAt as string)
            }));
        } catch (error) {
            console.error('Error fetching appointments from DynamoDB:', error);
            throw error;
        }
    }

}

export default AppointmentRepository;