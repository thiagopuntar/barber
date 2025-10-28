import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { ServicesConstruct } from './services-construct';
import { EmployeesConstruct } from './employees-construct';

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

    // Business ID resource (shared between constructs)
    const businessIdResource = api.root.addResource('{businessId}');

    // Instantiate endpoint constructs
    new ServicesConstruct(this, 'ServicesConstruct', {
      table: barberTable,
      businessIdResource: businessIdResource
    });

    new EmployeesConstruct(this, 'EmployeesConstruct', {
      table: barberTable,
      businessIdResource: businessIdResource
    });

    // Output the API Gateway URL
    new cdk.CfnOutput(this, 'ApiGatewayUrl', {
      value: api.url,
      description: 'API Gateway URL'
    });
  }
}
