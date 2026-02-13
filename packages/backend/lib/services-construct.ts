import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as path from "path";

interface ServicesConstructProps {
  table: dynamodb.Table;
  businessIdResource: apigateway.Resource;
  api: apigateway.RestApi;
  errorModel: apigateway.Model;
}

export class ServicesConstruct extends Construct {
  constructor(scope: Construct, id: string, props: ServicesConstructProps) {
    super(scope, id);

    const { table, businessIdResource, api, errorModel } = props;

    // Define Service model for the response
    const servicesResponseModel = api.addModel("ServicesResponseModel", {
      contentType: "application/json",
      modelName: "ServicesResponse",
      schema: {
        schema: apigateway.JsonSchemaVersion.DRAFT4,
        title: "ServicesResponse",
        type: apigateway.JsonSchemaType.OBJECT,
        properties: {
          businessId: { type: apigateway.JsonSchemaType.STRING },
          services: {
            type: apigateway.JsonSchemaType.ARRAY,
            items: {
              type: apigateway.JsonSchemaType.OBJECT,
              properties: {
                id: { type: apigateway.JsonSchemaType.STRING },
                name: { type: apigateway.JsonSchemaType.STRING },
                description: { type: apigateway.JsonSchemaType.STRING },
                price: { type: apigateway.JsonSchemaType.NUMBER },
                duration: { type: apigateway.JsonSchemaType.NUMBER },
                createdAt: { type: apigateway.JsonSchemaType.STRING, format: "date-time" },
                updatedAt: { type: apigateway.JsonSchemaType.STRING, format: "date-time" },
              },
              required: ["id", "name", "price", "duration"],
            },
          },
        },
        required: ["businessId", "services"],
      },
    });

    // Lambda function for getting services
    const getServicesLambda = new NodejsFunction(this, "GetServicesLambda", {
      runtime: lambda.Runtime.NODEJS_22_X,
      entry: path.join(__dirname, "../handlers/get-services.ts"),
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
    table.grantReadData(getServicesLambda);

    // Services resource
    const servicesResource = businessIdResource.addResource("services");

    // GET /services/{businessId} endpoint
    servicesResource.addMethod("GET", new apigateway.LambdaIntegration(getServicesLambda), {
      methodResponses: [
        {
          statusCode: "200",
          responseModels: {
            "application/json": servicesResponseModel,
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
    });
  }
}
