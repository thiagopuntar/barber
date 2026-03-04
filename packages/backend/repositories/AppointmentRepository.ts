import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import IAppointmentRepository from "./IAppointmentRepository";
import Appointment from "../models/Appointment";
import { Logger } from "../utils/Logger";

class AppointmentRepository implements IAppointmentRepository {
  private dynamoClient: DynamoDBDocumentClient;
  private tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
    const client = new DynamoDBClient({});
    this.dynamoClient = DynamoDBDocumentClient.from(client);
  }

  private _getPk(businessId: string): string {
    return `${businessId}#appointment`;
  }

  private _getSk(employeeId: string, date: Date, initialTime?: string): string {
    return `${employeeId}#${date.toISOString().split("T")[0]}${initialTime ? `#${initialTime}` : ""}`;
  }

  async getAppointmentsByEmployeeIdAndDate(
    businessId: string,
    employeeId: string,
    date: Date
  ): Promise<Appointment[]> {
    try {
      const pk = this._getPk(businessId);
      Logger.debug("pk", pk);

      const sk = this._getSk(employeeId, date);
      Logger.debug("sk", sk);

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
      Logger.error("Error fetching appointments from DynamoDB:", error);
      throw error;
    }
  }

  async createAppointment(businessId: string, appointment: Appointment): Promise<Appointment> {
    try {
      const payload = {
        pk: this._getPk(businessId),
        sk: this._getSk(appointment.employee.id, appointment.date),
        id: appointment.id,
        date: appointment.date.toISOString(),
        initialTime: appointment.initialTime,
        finalTime: appointment.finalTime,
        createdAt: appointment.createdAt.toISOString(),
        updatedAt: appointment.updatedAt.toISOString(),
        employee: appointment.employee,
        service: appointment.service,
        customer: appointment.customer,
      } 
      Logger.debug("Creating appointment in DynamoDB:", payload);

      const command = new PutCommand({
        TableName: this.tableName,
        Item: payload,
      });

      const createdAppointment = await this.dynamoClient.send(command);
      Logger.debug("Created appointment in DynamoDB:", createdAppointment);

      return createdAppointment.Attributes as Appointment;
    } catch (error) {
      Logger.error("Error creating appointment in DynamoDB:", error);
      throw error;
    }
  }
}

export default AppointmentRepository;
