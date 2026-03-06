import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Logger } from "../utils/Logger";
import { EmployeeRepository } from "../repositories/EmployeeRepository";
import ServiceRepository from "../repositories/ServiceRepository";
import AppointmentRepository from "../repositories/AppointmentRepository";
import CreateAvailabilityUseCase from "../use-cases/CreateAvailabilityUseCase";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const businessId = event.pathParameters?.businessId;

    if (!businessId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Business ID is required",
        }),
      };
    }

    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Body is required",
        }),
      };
    }

    // Dummy logic for now
    const appointmentId = "appt-123";

    // Access Cognito user information
    const userEmail = event.requestContext.authorizer?.claims?.email;
    const userId = event.requestContext.authorizer?.claims?.sub;

    const tableName = process.env.APPOINTMENT_TABLE_NAME;
    if (!tableName) {
      throw new Error("APPOINTMENT_TABLE_NAME environment variable is not set");
    }

    const employeeRepository = new EmployeeRepository(tableName);
    const serviceRepository = new ServiceRepository(tableName);
    const appointmentRepository = new AppointmentRepository(tableName);

    const createAvailabilityUseCase = new CreateAvailabilityUseCase(
      employeeRepository,
      serviceRepository,
      appointmentRepository
    );

    const { employeeId, serviceId, date, initialTime } = JSON.parse(event.body);

    const appointment = await createAvailabilityUseCase.execute({
      businessId,
      employeeId,
      serviceId,
      date: new Date(date),
      initialTime,
      customerData: {
        id: userId,
        name: userEmail,
      },
    });

    Logger.info(`Creating appointment for user: (${userId})`);

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        appointment,
      }),
    };
  } catch (error) {
    Logger.error("Error creating appointment:", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Internal server error",
      }),
    };
  }
};
