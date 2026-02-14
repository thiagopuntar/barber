import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as iam from "aws-cdk-lib/aws-iam";
import * as path from "path";
import * as fs from "fs";
import { ServicesConstruct } from "./services-construct";
import { EmployeesConstruct } from "./employees-construct";
import { AvailabilityConstruct } from "./availability-construct";
import { AuthConstruct } from "./auth-construct";
import { IAPIRestLambdaConstruct } from "./api-rest-lambda-construct";

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

    // Auth Construct
    new AuthConstruct(this, "AuthConstruct");

    const servicesConstruct = new ServicesConstruct(this, "ServicesConstruct", {
      table: barberTable,
    });

    const employeesConstruct = new EmployeesConstruct(this, "EmployeesConstruct", {
      table: barberTable,
    });

    const availabilityConstruct = new AvailabilityConstruct(this, "AvailabilityConstruct", {
      table: barberTable,
    });
    const apiRestLambdaConstructs: IAPIRestLambdaConstruct[] = [
      servicesConstruct,
      employeesConstruct,
      availabilityConstruct,
    ];

    const openApiTemplate = fs.readFileSync(
      path.join(__dirname, "../openapi.json"),
      "utf8"
    );
    let openApiWithSubstitutions = openApiTemplate
      .split("${AWS::Region}")
      .join(cdk.Aws.REGION);
    for (const apiRestLambdaConstruct of apiRestLambdaConstructs) {
      openApiWithSubstitutions = openApiWithSubstitutions
        .split(`\${${apiRestLambdaConstruct.lambdaName}}`)
        .join(apiRestLambdaConstruct.lambda.functionArn);
    }

    // API Gateway
    const api = new apigateway.SpecRestApi(this, "BarberApi", {
      restApiName: "Barber API",
      description: "API for Barber services",
      apiDefinition: apigateway.ApiDefinition.fromInline(JSON.parse(openApiWithSubstitutions)),
      deployOptions: {
        stageName: "prod",
      },
    });

    const invokePermission = {
      principal: new iam.ServicePrincipal("apigateway.amazonaws.com"),
      sourceArn: api.arnForExecuteApi("*"),
    };

    for (const apiRestLambdaConstruct of apiRestLambdaConstructs) {
      apiRestLambdaConstruct.lambda.addPermission(
        `AllowApiGatewayInvoke${apiRestLambdaConstruct.lambdaName}`,
        invokePermission
      );
    }

    // Output the API Gateway URL
    new cdk.CfnOutput(this, "ApiGatewayUrl", {
      value: api.url,
      description: "API Gateway URL",
    });
  }
}
