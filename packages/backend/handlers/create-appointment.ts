import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import { Logger } from "../utils/Logger";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
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
    const appointmentId = uuidv4();

    // Access Cognito user information
    const userEmail = event.requestContext.authorizer?.claims?.email;
    const userId = event.requestContext.authorizer?.claims?.sub;

    Logger.info(`Creating appointment for user: (${userId})`);

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        appointmentId,
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
