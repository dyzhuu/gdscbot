import {
    Client,
    GatewayIntentBits,
    Events,
    InteractionType,
    Collection
} from 'discord.js';
import config from './config';
import * as commandModules from './commands';
import Logging from './library/Logging';
import sheets from './middleware/GoogleSheetsAPI';

const { Guilds, MessageContent, GuildMessages, GuildMembers } =
    GatewayIntentBits;

const commands = Object(commandModules);

export const client = new Client({
    intents: [Guilds, MessageContent, GuildMessages, GuildMembers]
});

client.once(Events.ClientReady, (c) => {
    Logging.info(`Ready! Logged in as ${c.user.tag}`);
    setInterval(() => sheets.writeName(), 3600000);
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isChatInputCommand()) {
        const { commandName } = interaction;

        try {
            await commands[commandName].execute(interaction, client);
        } catch (err) {
            Logging.error(err);
        }
    } else if (
        interaction.type == InteractionType.ApplicationCommandAutocomplete
    ) {
        const { commandName } = interaction;

        try {
            await commands[commandName].autocomplete(interaction, client);
        } catch (error) {
            Logging.error(error);
        }
    }
});

client.login(config.TOKEN);
