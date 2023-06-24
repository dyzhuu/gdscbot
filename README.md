### Setup

1. Create a `.env` file in the root directory and enter the following environment variables:
```env
TOKEN=<discord bot token>
CLIENT_ID=<bot client id>
GUILD_ID=<discord server id>
SPREADSHEET_ID=<google sheets id>
CALENDAR_ID=<google calendar id>
URL=<API endpoint url>

SYNC_ID=<id of the channel to receive weekly sync pings>
ANNOUNCEMENT_ID=<id of the channel to receive announcements>
PING_ROLE_IDS=<id of roles to ping (space separated)>
```
2. Deploy commands to the bot
   ```sh
   yarn deploy:commands
   ```
3. Create a notification channel to receive webhooks
   ```sh
   yarn create:channel
   ```
4. Run the bot
   ```
   yarn start
   ```
