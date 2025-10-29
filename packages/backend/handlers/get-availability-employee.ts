import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { EmployeeRepository } from '../repositories/EmployeeRepository';
import AppointmentRepository from '../repositories/AppointmentRepository';
import Appointment from '../models/Appointment';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Extract businessId from path parameters
    const businessId = event.pathParameters?.businessId;
    const employeeId = event.pathParameters?.employeeId;
    
    if (!businessId || !employeeId) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, OPTIONS'
        },
        body: JSON.stringify({
          error: 'Business ID is required and employee ID is required'
        })
      };
    }

    // Get table name from environment variables
    const tableName = process.env.BARBER_TABLE_NAME;
    if (!tableName) {
      throw new Error('BARBER_TABLE_NAME environment variable is not set');
    }

    // Initialize repository and fetch services
    const employeeRepository = new EmployeeRepository(tableName);
    const employee = await employeeRepository.getEmployee(businessId, employeeId);

    const appointmentRepository = new AppointmentRepository(tableName);
    const appointments: Appointment[] = []
    const initialDate = new Date(event.queryStringParameters?.initialDate as string) || new Date();
    const finalDate = new Date(event.queryStringParameters?.finalDate as string) || new Date();

    for (let date = initialDate; date <= finalDate; date.setDate(date.getDate() + 1)) {
      const dayAppointments = await appointmentRepository.getAppointmentsByEmployeeIdAndDate(businessId, employeeId, date);
      appointments.push(...dayAppointments);
    }

    employee.addAppointments(appointments);



    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: JSON.stringify({
        businessId,
        employee
      })
    };

  } catch (error) {
    console.error('Error getting services:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: JSON.stringify({
        error: 'Internal server error'
      })
    };
  }
};
