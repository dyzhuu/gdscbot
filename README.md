<a href="https://console.cloud.google.com/apis/library/sheets.googleapis.com">Google Sheets API</a>

<a href="https://console.cloud.google.com/apis/library/calendar-json.googleapis.com">Google Calendar API</a>


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
   yarn deploy-commands
   ```
3. Create a notification channel to receive webhooks
   ```sh
   yarn create-channel
   ```
   Remember the `id` & `resourceId` to shut down the channel in the future

4. Run the bot
   ```
   yarn start
   ```

## Stopping notification channels
`POST` to `URL/stop`
```json
{
    "id": "<id>",
    "resourceId": "<resourceId>"
}
```
