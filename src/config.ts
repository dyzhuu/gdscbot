import dotenv from 'dotenv';
dotenv.config();
const {
    CLIENT_ID,
    GUILD_ID,
    TOKEN,
    SPREADSHEET_ID,
    CALENDAR_ID,
    URL,
    SYNC_CHANNEL_ID,
    ANNOUNCEMENT_CHANNEL_ID,
    PING_ROLE_IDS
} = process.env;
if (!CLIENT_ID) {
    throw new Error('Missing Client Id');
} else if (!GUILD_ID) {
    throw new Error('Missing Guild Id');
} else if (!TOKEN) {
    throw new Error('Missing Token');
} else if (!SPREADSHEET_ID) {
    throw new Error('Missing Spreadsheet Id');
} else if (!CALENDAR_ID) {
    throw new Error('Missing Calendar Id');
} else if (!URL) {
    throw new Error('Missing URL');
} else if (!SYNC_CHANNEL_ID) {
    throw new Error('Missing Weekly Sync Channel Id');
} else if (!ANNOUNCEMENT_CHANNEL_ID) {
    throw new Error('Missing Event Announcement Channel Id');
} else if (!PING_ROLE_IDS) {
    throw new Error('Missing Role Ids');
}

const config: Record<string, string> = {
    CLIENT_ID,
    GUILD_ID,
    TOKEN,
    SPREADSHEET_ID,
    CALENDAR_ID,
    URL,
    SYNC_CHANNEL_ID,
    ANNOUNCEMENT_CHANNEL_ID,
    PING_ROLE_IDS
};

export default config;
