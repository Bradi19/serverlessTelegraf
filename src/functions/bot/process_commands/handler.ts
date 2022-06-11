/* eslint-disable @typescript-eslint/no-explicit-any */
import { middyfy } from '@libs/lambda';
import { Telegraf } from 'telegraf';
const bot = new Telegraf('5290846070:AAFS3BLIFylc50S74_WFrTm6JOaGlIIQuYA');
bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.command('subscribe', (ctx) => {
  ctx.reply('data');
});
bot.on('text', (ctx) => {
  ctx.reply(ctx.update.message.text);
});
const processCommands = async (event) => {
  const body: any = event.body;
  bot.handleUpdate(body);
  return { statusCode: 200, body: '' };
};

export const main = middyfy(processCommands);

// TODO handle block bot by user request (we need to delete the user from db)
// TODO create an interface for the event
// {
//     "body":{
//     "update_id":777880778,
//         "my_chat_member":{
//         "chat":{
//             "id":369368584,
//                 "first_name":"Vladyslav",
//                 "username":"electricfoal",
//                 "type":"private"
//         },
//         "from":{
//             "id":369368584,
//                 "is_bot":false,
//                 "first_name":"Vladyslav",
//                 "username":"electricfoal",
//                 "language_code":"ru"
//         },
//         "date":1636664331,
//             "old_chat_member":{
//             "user":{
//                 "id":2101233898,
//                     "is_bot":true,
//                     "first_name":"notybotyfy",
//                     "username":"notybotyfy_bot"
//             },
//             "status":"member"
//         },
//         "new_chat_member":{
//             "user":{
//                 "id":2101233898,
//                     "is_bot":true,
//                     "first_name":"notybotyfy",
//                     "username":"notybotyfy_bot"
//             },
//             "status":"kicked",
//                 "until_date":0
//         }
//     }
// }
// }
