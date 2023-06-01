import dotenv from "dotenv"
dotenv.config()
const { CLIENT_ID, GUILD_ID, TOKEN, MONGO_URI, PORT } = process.env;
if(!CLIENT_ID || !GUILD_ID || !TOKEN || !MONGO_URI) {
    throw new Error("Missing environment variables")
}

const SERVER_PORT = PORT || "1337";

const config: Record<string, string> = {
    CLIENT_ID,
    GUILD_ID,
    TOKEN,
    MONGO_URI,
    SERVER_PORT,
}

export default config