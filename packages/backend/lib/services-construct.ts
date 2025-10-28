import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as path from 'path';

interface ServicesConstructProps {
  table: dynamodb.Table;
  businessIdResource: apigateway.Resource;
}

export class ServicesConstruct extends Construct {
  constructor(scope: Construct, id: string, props: ServicesConstructProps) {
    super(scope, id);

    const { table, businessIdResource } = props;

    // Lambda function for getting services
    const getServicesLambda = new NodejsFunction(this, 'GetServicesLambda', {
      runtime: lambda.Runtime.NODEJS_22_X,
      entry: path.join(__dirname, '../handlers/get-services.ts'),
      handler: 'handler',
      bundling: {
        forceDockerBundling: false,
        minify: true,
        sourceMap: false
      },
      environment: {
        NODE_ENV: 'production',
        BARBER_TABLE_NAME: table.tableName
      }
    });

    // Grant Lambda permissions to read from DynamoDB
    table.grantReadData(getServicesLambda);

    // Services resource
    const servicesResource = businessIdResource.addResource('services');

    // GET /services/{businessId} endpoint
    servicesResource.addMethod('GET', new apigateway.LambdaIntegration(getServicesLambda));
  }
}
