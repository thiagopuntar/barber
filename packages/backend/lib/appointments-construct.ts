import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as logs from "aws-cdk-lib/aws-logs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as path from "path";
import { IAPIRestLambdaConstruct } from "./api-rest-lambda-construct";

interface AppointmentsConstructProps {
  table: dynamodb.Table;
}

export class AppointmentsConstruct extends Construct implements IAPIRestLambdaConstruct {
  public readonly lambda: NodejsFunction;
  public readonly lambdaName: string = "CreateAppointmentLambdaArn";

  constructor(scope: Construct, id: string, props: AppointmentsConstructProps) {
    super(scope, id);

    const { table } = props;

    // Lambda function for creating appointments
    this.lambda = new NodejsFunction(this, "CreateAppointmentLambda", {
      functionName: "Appointment-CreateAppointment",
      runtime: lambda.Runtime.NODEJS_22_X,
      entry: path.join(__dirname, "../handlers/create-appointment.ts"),
      handler: "handler",
      logGroup: new logs.LogGroup(this, "CreateAppointmentLogGroup", {
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

    // Grant Lambda permissions to read/write from DynamoDB
    table.grantReadWriteData(this.lambda);
  }
}
