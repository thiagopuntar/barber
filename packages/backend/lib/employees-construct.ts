import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as path from "path";

interface EmployeesConstructProps {
  table: dynamodb.Table;
  businessIdResource: apigateway.Resource;
}

export class EmployeesConstruct extends Construct {
  constructor(scope: Construct, id: string, props: EmployeesConstructProps) {
    super(scope, id);

    const { table, businessIdResource } = props;

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
    employeesResource.addMethod("GET", new apigateway.LambdaIntegration(getEmployeesLambda));
  }
}
