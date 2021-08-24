import { WebSocketApi, WebSocketStage } from '@aws-cdk/aws-apigatewayv2';
import { LambdaWebSocketIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';
import { Peer, Port, SecurityGroup, SubnetType, Vpc } from '@aws-cdk/aws-ec2';
import { PolicyStatement } from '@aws-cdk/aws-iam';
import { Runtime, Code, Function as LambdaFunction } from '@aws-cdk/aws-lambda';

import * as cdk from '@aws-cdk/core';
import { CfnOutput } from '@aws-cdk/core';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = this.createVpc();
    const lambdaSg = this.createWebFacingSecurityGroup(vpc);
    const { connectHandler, disconnectHandler, getTxHandler } = this.createEventsHandler(vpc, lambdaSg);

    const webSocketApi = new WebSocketApi(this, 'mywsapi', {
      connectRouteOptions: { integration: new LambdaWebSocketIntegration({ handler: connectHandler }) },
      disconnectRouteOptions: {
        integration: new LambdaWebSocketIntegration({ handler: disconnectHandler }),
      },
    });

    webSocketApi.addRoute('getTx', {
      integration: new LambdaWebSocketIntegration({
        handler: getTxHandler,
      }),
    });

    // {"action":"getTx","data":"hello world"}

    const webSocketStage = new WebSocketStage(this, 'mystage', {
      webSocketApi,
      stageName: 'dev',
      autoDeploy: true,
    });

    const webSocketURL = webSocketStage.url;
    // wss://${this.api.apiId}.execute-api.${s.region}.${s.urlSuffix}/${urlPath}

    const callbackURL = webSocketStage.callbackUrl;
    // https://${this.api.apiId}.execute-api.${s.region}.${s.urlSuffix}/${urlPath}

    new CfnOutput(this, 'WebSocketURL', {
      exportName: 'websocket-url',
      value: webSocketURL,
    });

    new CfnOutput(this, 'WebSocketCallbackURL', {
      exportName: 'websocket-callback-url',
      value: callbackURL,
    });
  }

  private createWebFacingSecurityGroup(vpc: Vpc) {
    const lambdaSg = new SecurityGroup(this, 'lambda-sg', {
      securityGroupName: 'lambda-web-access',
      allowAllOutbound: true,
      vpc,
    });

    lambdaSg.addIngressRule(Peer.anyIpv4(), Port.tcp(80), 'http port');
    lambdaSg.addIngressRule(Peer.anyIpv4(), Port.tcp(443), 'https port');

    return lambdaSg;
  }

  private createEventsHandler(vpc: Vpc, sg: SecurityGroup) {
    const props = {
      vpcSubnets: {
        subnetType: SubnetType.PRIVATE,
      },
      environment: {},
      runtime: Runtime.NODEJS_14_X,
      vpc,
      securityGroups: [sg],
    };

    const connectHandler = new LambdaFunction(this, 'connect-handler', {
      ...props,
      code: Code.fromAsset('handlers/deploy'),
      handler: 'handlers.connectHandler', // handlers.js file, connectHandler function,
    });

    const disconnectHandler = new LambdaFunction(this, 'disconnect-handler', {
      ...props,
      code: Code.fromAsset('handlers/deploy'),
      handler: 'handlers.disconnectHandler',
    });

    const getTxHandler = new LambdaFunction(this, 'getTx-handler', {
      ...props,
      code: Code.fromAsset('handlers/deploy'),
      handler: 'handlers.getTxHandler',
    });

    // needs a permission to post messages to connected WebSocket clients.
    getTxHandler.addToRolePolicy(
      new PolicyStatement({ actions: ['execute-api:ManageConnections'], resources: ['*'] }),
    );

    return {
      connectHandler,
      disconnectHandler,
      getTxHandler,
    };
  }

  private createVpc() {
    return new Vpc(this, 'app-vpc', {
      cidr: '10.0.0.0/16',
      maxAzs: 2,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'public',
          subnetType: SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'private',
          subnetType: SubnetType.PRIVATE,
        },
      ],
    });
  }
}
