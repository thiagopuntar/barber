import { APIGatewayProxyResult } from "aws-lambda";
import { BusinessRepository } from "../repositories/BusinessRepository";
import { Logger } from "../utils/Logger";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

export const handler = async (): Promise<APIGatewayProxyResult> => {
  try {
    const tableName = process.env.APPOINTMENT_TABLE_NAME;
    if (!tableName) {
      throw new Error("APPOINTMENT_TABLE_NAME environment variable is not set");
    }

    const businessRepository = new BusinessRepository(tableName);
    const businesses = await businessRepository.getAll();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        businesses,
      }),
    };
  } catch (error) {
    Logger.error("Error getting businesses:", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Internal server error",
      }),
    };
  }
};
