import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as logs from "aws-cdk-lib/aws-logs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as path from "path";
import { IAPIRestLambdaConstruct } from "./api-rest-lambda-construct";

interface GetBusinessesConstructProps {
  table: dynamodb.Table;
}

export class GetBusinessesConstruct extends Construct implements IAPIRestLambdaConstruct {
  public readonly lambda: NodejsFunction;
  public readonly lambdaName: string = "GetBusinessesLambdaArn";

  constructor(scope: Construct, id: string, props: GetBusinessesConstructProps) {
    super(scope, id);

    const { table } = props;

    this.lambda = new NodejsFunction(this, "GetBusinessesLambda", {
      functionName: "Appointment-GetBusinesses",
      runtime: lambda.Runtime.NODEJS_22_X,
      entry: path.join(__dirname, "../handlers/get-businesses.ts"),
      handler: "handler",
      logGroup: new logs.LogGroup(this, "ListBusinessesLogGroup", {
        retention: logs.RetentionDays.THREE_DAYS,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      }),
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

    table.grantReadData(this.lambda);
  }
}
