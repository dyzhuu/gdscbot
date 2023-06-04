import { Client, GatewayIntentBits, Events } from 'discord.js';
import config from './config';
import * as commandModules from './commands';
import Logging from './library/Logging';

const { Guilds, MessageContent, GuildMessages, GuildMembers } =
    GatewayIntentBits;

const commands = Object(commandModules);

export const client = new Client({
    intents: [Guilds, MessageContent, GuildMessages, GuildMembers]
});

client.once(Events.ClientReady, (c) => {
    Logging.info(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) {
        return;
    }
    const { commandName } = interaction;

    try {
        await commands[commandName].execute(interaction, client);
    } catch (err) {
        Logging.error(err);
    }
});

client.login(config.TOKEN);