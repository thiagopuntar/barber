import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { EmployeeRepository } from "../repositories/EmployeeRepository";
import AppointmentRepository from "../repositories/AppointmentRepository";
import ServiceRepository from "../repositories/ServiceRepository";
import { GetAvailabilityUseCase } from "../use-cases/GetAvailabilityUseCase";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Extract businessId from path parameters
    const businessId = event.pathParameters?.businessId;
    const serviceId = event.pathParameters?.serviceId;
    const employeeId = event.pathParameters?.employeeId;

    if (!businessId || !employeeId || !serviceId) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
        },
        body: JSON.stringify({
          error: "Business ID is required and employee ID is required and service ID is required",
        }),
      };
    }

    // Get table name from environment variables
    const tableName = process.env.APPOINTMENT_TABLE_NAME;
    if (!tableName) {
      throw new Error("APPOINTMENT_TABLE_NAME environment variable is not set");
    }

    // Initialize repositories
    const employeeRepository = new EmployeeRepository(tableName);
    const serviceRepository = new ServiceRepository(tableName);
    const appointmentRepository = new AppointmentRepository(tableName);

    // Initialize use case
    const getAvailabilityUseCase = new GetAvailabilityUseCase(
      employeeRepository,
      serviceRepository,
      appointmentRepository
    );

    const initialDateStr = event.queryStringParameters?.initialDate;
    const finalDateStr = event.queryStringParameters?.finalDate;

    const initialDate = initialDateStr ? new Date(initialDateStr) : new Date();
    const finalDate = finalDateStr ? new Date(finalDateStr) : new Date();

    const freeSlots = await getAvailabilityUseCase.execute({
      businessId,
      serviceId,
      employeeId,
      initialDate,
      finalDate,
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
      },
      body: JSON.stringify({
        businessId,
        freeSlots,
      }),
    };
  } catch (error) {
    console.error("Error getting services:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
      },
      body: JSON.stringify({
        error: "Internal server error",
      }),
    };
  }
};
