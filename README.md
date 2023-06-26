<a href="https://console.cloud.google.com/apis/library/sheets.googleapis.com">Google Sheets API</a>

<a href="https://console.cloud.google.com/apis/library/calendar-json.googleapis.com">Google Calendar API</a>

## Setup

1. Create a `.env` file in the root directory and enter the following environment variables:
   ```env
   TOKEN=<discord bot token>
   CLIENT_ID=<bot client id>
   GUILD_ID=<discord server id>
   SPREADSHEET_ID=<google sheets id>
   CALENDAR_ID=<google calendar id>
   SYNC_ID=<id of the channel to receive weekly sync pings>
   ANNOUNCEMENT_ID=<id of the channel to receive announcements>
   PING_ROLE_IDS=<id of roles to ping (space separated)>

   URL=<API endpoint url>
   UUID=<UUID>
   PORT=<PORT>
   ```
   Bottom three variables are only required if enabling event creation pings

2. Deploy commands to the bot
   ```sh
   yarn deploy-commands
   ```

3. Run the bot
   ```
   yarn start
   ```

### Stopping notification channels
`POST` to `URL/stop`
```json
{
    "id": "<id>",
    "resourceId": "<resourceId>"
}
```
