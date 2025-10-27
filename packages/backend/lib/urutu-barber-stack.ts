import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as path from 'path';

export class UrutuBarberStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB table
    const barberTable = new dynamodb.Table(this, 'BarberTable', {
      tableName: 'BarberTable',
      partitionKey: {
        name: 'pk',
        type: dynamodb.AttributeType.STRING
      },
      sortKey: {
        name: 'sk',
        type: dynamodb.AttributeType.STRING
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY // For development only
    });

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
        BARBER_TABLE_NAME: barberTable.tableName
      }
    });


    const getEmployeesLambda = new NodejsFunction(this, 'GetEmployeesLambda', {
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
        BARBER_TABLE_NAME: barberTable.tableName
      }
    });

    // Grant Lambda permissions to read from DynamoDB
    barberTable.grantReadData(getServicesLambda);

    // API Gateway
    const api = new apigateway.RestApi(this, 'UrutuBarberApi', {
      restApiName: 'Urutu Barber API',
      description: 'API for Urutu Barber services',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization']
      }
    });

    // Services resource with businessId parameter
    const businessIdResource = api.root.addResource('{businessId}');
    const servicesResource = businessIdResource.addResource('services');
    const employeesResource = businessIdResource.addResource('employees');
    
    // GET /services/{businessId} endpoint
    servicesResource.addMethod('GET', new apigateway.LambdaIntegration(getServicesLambda));
    employeesResource.addMethod('GET', new apigateway.LambdaIntegration(getEmployeesLambda));

    // Output the API Gateway URL
    new cdk.CfnOutput(this, 'ApiGatewayUrl', {
      value: api.url,
      description: 'API Gateway URL'
    });
  }
}
