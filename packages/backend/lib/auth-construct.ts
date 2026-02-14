import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as cognito from "aws-cdk-lib/aws-cognito";

export class AuthConstruct extends Construct {
  public readonly userPool: cognito.UserPool;
  public readonly userPoolClient: cognito.UserPoolClient;
  public readonly userPoolDomain: cognito.UserPoolDomain;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Create Cognito User Pool
    this.userPool = new cognito.UserPool(this, "AppointmentUserPool", {
      userPoolName: "AppointmentUserPool",
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
      },
      autoVerify: {
        email: true,
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
        phoneNumber: {
          required: false,
          mutable: true,
        },
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // For development only
    });

    // Create User Pool Client
    this.userPoolClient = new cognito.UserPoolClient(this, "AppointmentUserPoolClient", {
      userPool: this.userPool,
      userPoolClientName: "AppointmentWebClient",
      generateSecret: true,
      authFlows: {
        userPassword: true,
        adminUserPassword: true,
        custom: true,
      },
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        scopes: [
          cognito.OAuthScope.OPENID,
          cognito.OAuthScope.EMAIL,
          cognito.OAuthScope.PROFILE,
        ],
        callbackUrls: ["http://localhost:3000/api/auth/callback/cognito"],
        logoutUrls: ["http://localhost:3000"],
      },
    });

    const safeSuffix = cdk.Names.uniqueId(this)
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "");
    const domainPrefix = `appointment-auth-${safeSuffix}`
      .slice(0, 63)
      .replace(/^-+/, "")
      .replace(/-+$/, "");

    this.userPoolDomain = this.userPool.addDomain("AuthDomain", {
      cognitoDomain: {
        domainPrefix,
      },
    });

    // Export some important values
    new cdk.CfnOutput(this, "UserPoolId", {
      value: this.userPool.userPoolId,
      description: "ID of the User Pool",
    });

    new cdk.CfnOutput(this, "UserPoolClientId", {
      value: this.userPoolClient.userPoolClientId,
      description: "ID of the User Pool Client",
    });

    if (this.userPoolClient.userPoolClientSecret) {
      new cdk.CfnOutput(this, "UserPoolClientSecret", {
        value: this.userPoolClient.userPoolClientSecret.unsafeUnwrap(),
        description: "Secret of the User Pool Client",
      });
    }

    new cdk.CfnOutput(this, "UserPoolDomain", {
      value: this.userPoolDomain.domainName,
      description: "Cognito Hosted UI domain",
    });
  }
}
