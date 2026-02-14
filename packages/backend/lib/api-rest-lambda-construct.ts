import { IConstruct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export interface IAPIRestLambdaConstruct extends IConstruct {
  readonly lambda: NodejsFunction;
  readonly lambdaName: string;
}
