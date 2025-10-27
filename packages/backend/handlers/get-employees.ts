import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { EmployeeRepository } from '../repositories/EmployeeRepository';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Extract businessId from path parameters
    const businessId = event.pathParameters?.businessId;
    
    if (!businessId) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, OPTIONS'
        },
        body: JSON.stringify({
          error: 'Business ID is required'
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
    const employees = await employeeRepository.getEmployeesByBusinessId(businessId);

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
        employees
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
