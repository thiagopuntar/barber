import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as path from "path";

interface AvailabilityConstructProps {
  table: dynamodb.Table;
  businessIdResource: apigateway.Resource;
}

export class AvailabilityConstruct extends Construct {
  constructor(scope: Construct, id: string, props: AvailabilityConstructProps) {
    super(scope, id);

    const { table, businessIdResource } = props;

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
      new apigateway.LambdaIntegration(getAvailabilityEmployeeLambda)
    );
  }
}
