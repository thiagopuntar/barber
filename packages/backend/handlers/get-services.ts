import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import Service from '../models/Service';

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

    // Mock data for services
    const mockServices = [
      {
        id: '1',
        name: 'Haircut',
        description: 'Professional haircut service',
        price: 25.00,
        duration: 30,
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date('2024-01-01').toISOString()
      },
      {
        id: '2',
        name: 'Beard Trim',
        description: 'Professional beard trimming and styling',
        price: 15.00,
        duration: 20,
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date('2024-01-01').toISOString()
      },
      {
        id: '3',
        name: 'Haircut + Beard',
        description: 'Complete grooming service including haircut and beard trim',
        price: 35.00,
        duration: 45,
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date('2024-01-01').toISOString()
      }
    ];

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
        services: mockServices
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
