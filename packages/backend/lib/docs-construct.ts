import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as path from "path";

interface DocsConstructProps {
  openApiSpec: string;
}

export class DocsConstruct extends Construct {
  constructor(scope: Construct, id: string, props: DocsConstructProps) {
    super(scope, id);

    // Create S3 bucket for docs
    const docsBucket = new s3.Bucket(this, "DocsBucket", {
      websiteIndexDocument: "index.html",
      publicReadAccess: true,
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: true,
        blockPublicPolicy: false,
        ignorePublicAcls: true,
        restrictPublicBuckets: false,
      }),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Deploy Swagger UI and OpenAPI spec
    new s3deploy.BucketDeployment(this, "DeployDocs", {
      sources: [
        s3deploy.Source.asset(path.join(__dirname, "../docs-ui")),
        s3deploy.Source.data("openapi.json", props.openApiSpec),
      ],
      destinationBucket: docsBucket,
    });

    // Output the Docs URL
    new cdk.CfnOutput(this, "DocsUrl", {
      value: docsBucket.bucketWebsiteUrl,
      description: "Swagger UI Documentation URL",
    });
  }
}
