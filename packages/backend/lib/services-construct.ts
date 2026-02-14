import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as path from "path";
import { IAPIRestLambdaConstruct } from "./api-rest-lambda-construct";

interface ServicesConstructProps {
  table: dynamodb.Table;
}

export class ServicesConstruct extends Construct implements IAPIRestLambdaConstruct {
  public readonly lambda: NodejsFunction;
  public readonly lambdaName: string = "GetServicesLambdaArn";

  constructor(scope: Construct, id: string, props: ServicesConstructProps) {
    super(scope, id);

    const { table } = props;

    // Lambda function for getting services
    this.lambda = new NodejsFunction(this, "GetServicesLambda", {
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
    table.grantReadData(this.lambda);
  }
}
