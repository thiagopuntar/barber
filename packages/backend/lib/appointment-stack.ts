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
import { BusinessConstruct } from "./business-construct";
import { AuthConstruct } from "./auth-construct";
import { AvailabilityPerSlotConstruct } from "./availability-per-slot-construct";
import { IAPIRestLambdaConstruct } from "./api-rest-lambda-construct";
import { DocsConstruct } from "./docs-construct";

export class AppointmentStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB table
    const appointmentTable = new dynamodb.Table(this, "AppointmentTable", {
      tableName: "AppointmentTable",
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
      table: appointmentTable,
    });

    const employeesConstruct = new EmployeesConstruct(this, "EmployeesConstruct", {
      table: appointmentTable,
    });

    const availabilityConstruct = new AvailabilityConstruct(this, "AvailabilityConstruct", {
      table: appointmentTable,
    });

    const businessConstruct = new BusinessConstruct(this, "BusinessConstruct", {
      table: appointmentTable,
    });

    const availabilityPerSlotConstruct = new AvailabilityPerSlotConstruct(this, "AvailabilityPerSlotConstruct", {
      table: appointmentTable,
    });

    const apiRestLambdaConstructs: IAPIRestLambdaConstruct[] = [
      servicesConstruct,
      employeesConstruct,
      availabilityConstruct,
      businessConstruct,
      availabilityPerSlotConstruct,
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
    const api = new apigateway.SpecRestApi(this, "AppointmentApi", {
      restApiName: "Appointment API",
      description: "API for Appointment services",
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

    // Deploy Documentation UI to S3
    new DocsConstruct(this, "DocsConstruct", {
      openApiSpec: openApiWithSubstitutions,
    });
  }
}
