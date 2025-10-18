import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';

export class UrutuBarberStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda function for getting services
    const getServicesLambda = new lambda.Function(this, 'GetServicesLambda', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'get-services.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../handlers')),
      environment: {
        NODE_ENV: 'production'
      }
    });

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
    const servicesResource = api.root.addResource('services');
    const businessIdResource = servicesResource.addResource('{businessId}');
    
    // GET /services/{businessId} endpoint
    businessIdResource.addMethod('GET', new apigateway.LambdaIntegration(getServicesLambda));

    // Output the API Gateway URL
    new cdk.CfnOutput(this, 'ApiGatewayUrl', {
      value: api.url,
      description: 'API Gateway URL'
    });
  }
}
