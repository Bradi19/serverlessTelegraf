- Set Telegram webhook
```
curl POST 'https://api.telegram.org/bot{TOKEN}/setWebhook' --header 'Content-Type: application/json' --data-raw '{ "url": "{WEBHOOK}"}'
```