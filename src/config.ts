import dotenv from 'dotenv';
dotenv.config();
const { CLIENT_ID, GUILD_ID, TOKEN, SPREADSHEET_ID, CALENDAR_ID, URL } =
    process.env;
if (
    !CLIENT_ID ||
    !GUILD_ID ||
    !TOKEN ||
    !SPREADSHEET_ID ||
    !CALENDAR_ID ||
    !URL
) {
    throw new Error('Missing environment variables');
}

const config: Record<string, string> = {
    CLIENT_ID,
    GUILD_ID,
    TOKEN,
    SPREADSHEET_ID,
    CALENDAR_ID,
    URL
};

export default config;
