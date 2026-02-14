import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as path from "path";
import { IAPIRestLambdaConstruct } from "./api-rest-lambda-construct";

interface EmployeesConstructProps {
  table: dynamodb.Table;
}

export class EmployeesConstruct extends Construct implements IAPIRestLambdaConstruct {
  public readonly lambda: NodejsFunction;
  public readonly lambdaName: string = "GetEmployeesLambdaArn";

  constructor(scope: Construct, id: string, props: EmployeesConstructProps) {
    super(scope, id);

    const { table } = props;

    this.lambda = new NodejsFunction(this, "GetEmployeesLambda", {
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
        APPOINTMENT_TABLE_NAME: table.tableName,
      },
    });

    // Grant Lambda permissions to read from DynamoDB
    table.grantReadData(this.lambda);
  }
}
