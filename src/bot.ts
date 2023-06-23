import { Client, GatewayIntentBits, Events, InteractionType } from 'discord.js';
import config from './config';
import * as commandModules from './commands';
import Logging from './library/Logging';
import sheets from './services/googleSheetsAPI';
import { CronJob } from 'cron';
import weeklySync from './scheduled/weeklySync';
import * as calendar from './services/googleCalendarAPI';
import { calendar_v3 } from 'googleapis';
import announceEvent from './scheduled/scheduledEvent';

const { Guilds, MessageContent, GuildMessages, GuildMembers } =
    GatewayIntentBits;

const commands = Object(commandModules);

export const client = new Client({
    intents: [Guilds, MessageContent, GuildMessages, GuildMembers]
});

client.once(Events.ClientReady, (c) => {
    Logging.info(`🤖 Ready! Logged in as ${c.user.tag}`);
    sheets.writeName();
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

client.login(config.TOKEN).then( () => {
    new CronJob(
        '0 30 18 * * 4',
        () => weeklySync(client),
        null,
        true
    );

    new CronJob(
        '15 28 * * * *',
        async () => {
            const events = await calendar.getNextEvents() as calendar_v3.Schema$Event[];
            if (!events[0]) {
                return;
            }
            console.log(events)
            events.forEach((event: calendar_v3.Schema$Event) => {
                new CronJob(
                    new Date(event.start!.dateTime as string),
                    () => announceEvent(client, event),
                    null,
                    true
                );
            });
        },
        null,
        true
    )
    // new CronJob(
    //     '0 0 0 * * *',
    //     () => {
    //         const events = [null]; // await getNextEvents()
    //         if (!events[0]) {
    //             return;
    //         }
    //         for ( const event of events ) {
                
    //         }
    //     },
    //     null,
    //     true
    // )
})

