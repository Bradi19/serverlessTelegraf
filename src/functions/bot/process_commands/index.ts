import { handlerPath } from '@libs//handler-resolver';

const handler = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'telegram/processCommands'
      }
    }
  ]
};

export default handler;
