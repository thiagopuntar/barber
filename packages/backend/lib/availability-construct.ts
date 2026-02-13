import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as path from "path";

interface AvailabilityConstructProps {
  table: dynamodb.Table;
  businessIdResource: apigateway.Resource;
  api: apigateway.RestApi;
  errorModel: apigateway.Model;
}

export class AvailabilityConstruct extends Construct {
  constructor(scope: Construct, id: string, props: AvailabilityConstructProps) {
    super(scope, id);

    const { table, businessIdResource, api, errorModel } = props;

    // Define Availability model for the response
    const availabilityResponseModel = api.addModel("AvailabilityResponseModel", {
      contentType: "application/json",
      modelName: "AvailabilityResponse",
      schema: {
        schema: apigateway.JsonSchemaVersion.DRAFT4,
        title: "AvailabilityResponse",
        type: apigateway.JsonSchemaType.OBJECT,
        properties: {
          businessId: { type: apigateway.JsonSchemaType.STRING },
          freeSlots: {
            type: apigateway.JsonSchemaType.ARRAY,
            items: {
              type: apigateway.JsonSchemaType.OBJECT,
              properties: {
                date: { type: apigateway.JsonSchemaType.STRING, format: "date-time" },
                slots: {
                  type: apigateway.JsonSchemaType.ARRAY,
                  items: {
                    type: apigateway.JsonSchemaType.OBJECT,
                    properties: {
                      start: { type: apigateway.JsonSchemaType.STRING },
                      end: { type: apigateway.JsonSchemaType.STRING },
                    },
                    required: ["start", "end"],
                  },
                },
              },
              required: ["date", "slots"],
            },
          },
        },
        required: ["businessId", "freeSlots"],
      },
    });

    const getAvailabilityEmployeeLambda = new NodejsFunction(
      this,
      "GetAvailabilityEmployeeLambda",
      {
        runtime: lambda.Runtime.NODEJS_22_X,
        entry: path.join(__dirname, "../handlers/get-availability-employee.ts"),
        handler: "handler",
        bundling: {
          forceDockerBundling: false,
          minify: true,
          sourceMap: false,
        },
        environment: {
          NODE_ENV: "production",
          BARBER_TABLE_NAME: table.tableName,
        },
      }
    );

    // Grant Lambda permissions to read from DynamoDB
    table.grantReadData(getAvailabilityEmployeeLambda);

    // Employees resource
    const employeesResource = businessIdResource
      .addResource("availability")
      .addResource("services")
      .addResource("{serviceId}")
      .addResource("employees")
      .addResource("{employeeId}");

    // GET /employees/{businessId} endpoint
    employeesResource.addMethod(
      "GET",
      new apigateway.LambdaIntegration(getAvailabilityEmployeeLambda),
      {
        methodResponses: [
          {
            statusCode: "200",
            responseModels: {
              "application/json": availabilityResponseModel,
            },
          },
          {
            statusCode: "400",
            responseModels: {
              "application/json": errorModel,
            },
          },
          {
            statusCode: "500",
            responseModels: {
              "application/json": errorModel,
            },
          },
        ],
      }
    );
  }
}
