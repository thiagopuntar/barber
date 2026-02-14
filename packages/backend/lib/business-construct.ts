import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as path from "path";
import { IAPIRestLambdaConstruct } from "./api-rest-lambda-construct";

interface BusinessConstructProps {
  table: dynamodb.Table;
}

export class BusinessConstruct extends Construct implements IAPIRestLambdaConstruct {
  public readonly lambda: NodejsFunction;
  public readonly lambdaName: string = "GetBusinessLambdaArn";

  constructor(scope: Construct, id: string, props: BusinessConstructProps) {
    super(scope, id);

    const { table } = props;

    // Lambda function for getting business details
    this.lambda = new NodejsFunction(this, "GetBusinessLambda", {
      runtime: lambda.Runtime.NODEJS_22_X,
      entry: path.join(__dirname, "../handlers/get-business.ts"),
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
