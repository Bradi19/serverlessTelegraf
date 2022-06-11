import { EventBridge } from 'aws-sdk';

export const eventBridge = new EventBridge({ region: 'eu-west-1' });
