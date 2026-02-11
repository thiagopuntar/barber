import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { ServicesConstruct } from "./services-construct";
import { EmployeesConstruct } from "./employees-construct";
import { AvailabilityConstruct } from "./availability-construct";

export class BarberStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB table
    const barberTable = new dynamodb.Table(this, "BarberTable", {
      tableName: "BarberTable",
      partitionKey: {
        name: "pk",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "sk",
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // For development only
    });

    // API Gateway
    const api = new apigateway.RestApi(this, "UrutuBarberApi", {
      restApiName: "Urutu Barber API",
      description: "API for Urutu Barber services",
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ["Content-Type", "Authorization"],
      },
    });

    // Generic Error Model
    const errorModel = api.addModel("ErrorModel", {
      contentType: "application/json",
      modelName: "ErrorResponse",
      schema: {
        schema: apigateway.JsonSchemaVersion.DRAFT4,
        title: "ErrorResponse",
        type: apigateway.JsonSchemaType.OBJECT,
        properties: {
          error: { type: apigateway.JsonSchemaType.STRING },
        },
        required: ["error"],
      },
    });

    // Business ID resource (shared between constructs)
    const businessIdResource = api.root.addResource("{businessId}");

    // Instantiate endpoint constructs
    new ServicesConstruct(this, "ServicesConstruct", {
      table: barberTable,
      businessIdResource: businessIdResource,
      api,
      errorModel: errorModel,
    });

    new EmployeesConstruct(this, "EmployeesConstruct", {
      table: barberTable,
      businessIdResource: businessIdResource,
      api,
      errorModel: errorModel,
    });

    new AvailabilityConstruct(this, "AvailabilityConstruct", {
      table: barberTable,
      businessIdResource: businessIdResource,
      api,
      errorModel: errorModel,
    });

    // Output the API Gateway URL
    new cdk.CfnOutput(this, "ApiGatewayUrl", {
      value: api.url,
      description: "API Gateway URL",
    });
  }
}
