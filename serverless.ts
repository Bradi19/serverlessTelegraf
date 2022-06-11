import type { AWS } from '@serverless/typescript';
import { bot } from '@functions/index';

const serverlessConfiguration: AWS = {
  service: 'telegram-bot',
  frameworkVersion: '3',
  plugins: [
    'serverless-esbuild',
    'serverless-dotenv-plugin',
    'serverless-offline',
    'serverless-localstack'
  ],

  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: "${opt:stage, 'dev'}",
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',

      TELEGRAM_USERS_TABLE_NAME: '${self:custom.tgUsersTable.name}',
      TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN
    },
    iamRoleStatements: [
      // TODO isolate im roles in separate file
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:BatchWriteItem',
          'dynamodb:PutItem',
          'dynamodb:Scan'
        ],
        Resource: [{ 'Fn::GetAtt': ['TgUsersTable', 'Arn'] }]
      }
    ]
  },
  // import the function via paths
  functions: { bot },
  resources: {
    Resources: {
      // TODO isolate resources in separate file
      TgUsersTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'TgUsersTable-${self:provider.stage}',
          BillingMode: 'PAY_PER_REQUEST',
          AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
          KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }]
        }
      }
    }
  },
  package: { individually: true },
  custom: {
    localstack: {
      stages: 'local',
      host: 'http://localhost',
      edgePort: 4566,
      utostart: true,
      networks: 'host, overlay, my_custom_network',
      lambda: {
        mountCode: true
      },
      docker: {
        sudo: false
      }
    },
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['utils-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10
    },
    tgUsersTable: {
      name: { Ref: ['TgUsersTable'] },
      arn: { 'Fn::GetAtt': ['TgUsersTable', 'Arn'] }
    }
  }
};

module.exports = serverlessConfiguration;
