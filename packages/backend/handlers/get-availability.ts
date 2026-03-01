import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { EmployeeRepository } from "../repositories/EmployeeRepository";
import AppointmentRepository from "../repositories/AppointmentRepository";
import ServiceRepository from "../repositories/ServiceRepository";
import { GetAvailabilityPerSlotUseCase } from "../use-cases/GetAvailabilityPerSlotUseCase";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Extract businessId from path parameters
    const businessId = event.pathParameters?.businessId;
    const serviceId = event.pathParameters?.serviceId;

    if (!businessId || !serviceId) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
        },
        body: JSON.stringify({
          error: "Business ID is required and service ID is required",
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

    const getAvailabilityPerSlotUseCase = new GetAvailabilityPerSlotUseCase(
      employeeRepository,
      serviceRepository,
      getAvailabilityUseCase
    );

    const initialDateStr = event.queryStringParameters?.initialDate;
    const finalDateStr = event.queryStringParameters?.finalDate;

    const initialDate = initialDateStr ? new Date(initialDateStr) : new Date();
    const finalDate = finalDateStr ? new Date(finalDateStr) : new Date();

    const freeSlots = await getAvailabilityPerSlotUseCase.execute({
      businessId,
      serviceId,
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
    console.error("Error getting availability:", error);

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
