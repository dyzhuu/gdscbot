import dotenv from 'dotenv';
dotenv.config();
const {
  CLIENT_ID,
  GUILD_ID,
  TOKEN,
  SPREADSHEET_ID,
  CALENDAR_ID,
  SYNC_CHANNEL_ID,
  ANNOUNCEMENT_CHANNEL_ID,
  PING_ROLE_IDS,
  PRESIDENT_ID,
  TREASURER_ID,
  CREDENTIALS_JSON
} = process.env;
if (!CLIENT_ID) {
  throw new Error('Missing Client ID environment variable');
} else if (!GUILD_ID) {
  throw new Error('Missing Guild ID environment variable');
} else if (!TOKEN) {
  throw new Error('Missing Token environment variable');
} else if (!SPREADSHEET_ID) {
  throw new Error('Missing Spreadsheet ID environment variable');
} else if (!CALENDAR_ID) {
  throw new Error('Missing Calendar ID environment variable');
} else if (!CREDENTIALS_JSON) {
  throw new Error('Missing Credentials environment variable');
} else if (!SYNC_CHANNEL_ID) {
  throw new Error('Missing Weekly Sync Channel ID environment variable');
} else if (!ANNOUNCEMENT_CHANNEL_ID) {
  throw new Error('Missing Event Announcement Channel ID ');
} else if (!PING_ROLE_IDS) {
  throw new Error('Missing Role IDs environment variable');
} else if (!PRESIDENT_ID) {
  throw new Error('Missing Role IDs environment variable');
} else if (!TREASURER_ID) {
  throw new Error('Missing Role IDs environment variable');
}
const config: Record<string, string> = {
  CLIENT_ID,
  GUILD_ID,
  TOKEN,
  SPREADSHEET_ID,
  CALENDAR_ID,
  SYNC_CHANNEL_ID,
  ANNOUNCEMENT_CHANNEL_ID,
  PING_ROLE_IDS,
  PRESIDENT_ID,
  TREASURER_ID,
  CREDENTIALS_JSON
};

export default config;
