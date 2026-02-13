import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as path from "path";

interface EmployeesConstructProps {
  table: dynamodb.Table;
  businessIdResource: apigateway.Resource;
  api: apigateway.RestApi;
  errorModel: apigateway.Model;
}

export class EmployeesConstruct extends Construct {
  constructor(scope: Construct, id: string, props: EmployeesConstructProps) {
    super(scope, id);

    const { table, businessIdResource, api, errorModel } = props;

    // Define Employee model for the response
    const employeesResponseModel = api.addModel("EmployeesResponseModel", {
      contentType: "application/json",
      modelName: "EmployeesResponse",
      schema: {
        schema: apigateway.JsonSchemaVersion.DRAFT4,
        title: "EmployeesResponse",
        type: apigateway.JsonSchemaType.OBJECT,
        properties: {
          businessId: { type: apigateway.JsonSchemaType.STRING },
          employees: {
            type: apigateway.JsonSchemaType.ARRAY,
            items: {
              type: apigateway.JsonSchemaType.OBJECT,
              properties: {
                id: { type: apigateway.JsonSchemaType.STRING },
                name: { type: apigateway.JsonSchemaType.STRING },
                availability: {
                  type: apigateway.JsonSchemaType.ARRAY,
                  items: {
                    type: apigateway.JsonSchemaType.OBJECT,
                    properties: {
                      weekDay: { type: apigateway.JsonSchemaType.NUMBER },
                      range: {
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
                    required: ["weekDay", "range"],
                  },
                },
                createdAt: { type: apigateway.JsonSchemaType.STRING, format: "date-time" },
                updatedAt: { type: apigateway.JsonSchemaType.STRING, format: "date-time" },
              },
              required: ["id", "name"],
            },
          },
        },
        required: ["businessId", "employees"],
      },
    });

    const getEmployeesLambda = new NodejsFunction(this, "GetEmployeesLambda", {
      runtime: lambda.Runtime.NODEJS_22_X,
      entry: path.join(__dirname, "../handlers/get-employees.ts"),
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
    });

    // Grant Lambda permissions to read from DynamoDB
    table.grantReadData(getEmployeesLambda);

    // Employees resource
    const employeesResource = businessIdResource.addResource("employees");

    // GET /employees/{businessId} endpoint
    employeesResource.addMethod(
      "GET",
      new apigateway.LambdaIntegration(getEmployeesLambda),
      {
        methodResponses: [
          {
            statusCode: "200",
            responseModels: {
              "application/json": employeesResponseModel,
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
