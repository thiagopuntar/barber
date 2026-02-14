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

  private getPk(businessId: string): string {
    return `${businessId}#appointment`;
  }

  async getAppointmentsByEmployeeIdAndDate(
    businessId: string,
    employeeId: string,
    date: Date
  ): Promise<Appointment[]> {
    try {
      const pk = this.getPk(businessId);
      console.debug("pk", pk);

      const sk = `${employeeId}#${date.toISOString().split("T")[0]}`;
      console.debug("sk", sk);

      const command = new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: "pk = :pk and sk = begins_with(:sk)",
        ExpressionAttributeValues: {
          ":pk": pk,
          ":sk": sk,
        },
      });

      const result = await this.dynamoClient.send(command);

      if (!result.Items) {
        return [];
      }

      return result.Items.map(item => {
        const appointment = new Appointment();
        appointment.id = item.id as string;
        appointment.date = new Date(item.date as string);
        appointment.initialTime = item.initialTime as string;
        appointment.finalTime = item.finalTime as string;
        appointment.createdAt = new Date(item.createdAt as string);
        appointment.updatedAt = new Date(item.updatedAt as string);
        return appointment;
      });
    } catch (error) {
      console.error("Error fetching appointments from DynamoDB:", error);
      throw error;
    }
  }
}

export default AppointmentRepository;
