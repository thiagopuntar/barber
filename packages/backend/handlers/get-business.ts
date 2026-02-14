import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { BusinessRepository } from "../repositories/BusinessRepository";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
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

    const tableName = process.env.APPOINTMENT_TABLE_NAME;
    if (!tableName) {
      throw new Error("APPOINTMENT_TABLE_NAME environment variable is not set");
    }

    const businessRepository = new BusinessRepository(tableName);
    const business = await businessRepository.getBusinessById(businessId);

    if (!business) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          error: "Business not found",
        }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        business,
      }),
    };
  } catch (error) {
    console.error("Error getting business:", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Internal server error",
      }),
    };
  }
};
