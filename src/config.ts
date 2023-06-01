import dotenv from "dotenv"
dotenv.config()
const { CLIENT_ID, GUILD_ID, TOKEN } = process.env;
if(!CLIENT_ID || !GUILD_ID || !TOKEN) {
    throw new Error("Missing environment variables")
}

const config: Record<string, string> = {
    CLIENT_ID,
    GUILD_ID,
    TOKEN
}

export default config