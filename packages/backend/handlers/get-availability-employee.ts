import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { EmployeeRepository } from "../repositories/EmployeeRepository";
import AppointmentRepository from "../repositories/AppointmentRepository";
import ServiceRepository from "../repositories/ServiceRepository";
import { SlotPerDay } from "../models/Employee";

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

    // Initialize repository and fetch services
    const employeeRepository = new EmployeeRepository(tableName);
    const employee = await employeeRepository.getEmployee(businessId, employeeId);

    const serviceRepository = new ServiceRepository(tableName);
    const service = await serviceRepository.getServiceById(businessId, serviceId);

    const appointmentRepository = new AppointmentRepository(tableName);
    const initialDate = new Date(event.queryStringParameters?.initialDate as string) || new Date();
    const finalDate = new Date(event.queryStringParameters?.finalDate as string) || new Date();

    const freeSlots: SlotPerDay[] = [];

    for (let date = initialDate; date <= finalDate; date.setDate(date.getDate() + 1)) {
      const appointments = await appointmentRepository.getAppointmentsByEmployeeIdAndDate(
        businessId,
        employeeId,
        date
      );
      employee.addAppointments(appointments);
      const slots = employee.getSlotPerDay(date, service.duration);
      freeSlots.push(...slots);
    }

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
