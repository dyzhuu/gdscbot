import {
    Client,
    TextChannel,
    EmbedBuilder,
    GatewayIntentBits,
    APIEmbedField
} from 'discord.js';

import Logging from '../library/Logging';
import { calendar_v3 } from 'googleapis';
import config from '../config';

// announces event as a discord embed
async function announceEvent(event: calendar_v3.Schema$Event, message: string) {
    const channelId = config.ANNOUNCEMENT_CHANNEL_ID;
    const rolesIds = config.PING_ROLE_IDS.split(' ');

    const client = new Client({ intents: GatewayIntentBits.Guilds });

    client
        .login(config.TOKEN)
        .then(async () => {
            const channel = (await client.channels.fetch(
                channelId
            )) as TextChannel;
            if (!channel) {
                Logging.error(`Channel ${channelId} does not exist`);
            }

            const fields: APIEmbedField[] = [
                {
                    name: 'Time',
                    value: `<t:${
                        new Date(event.start?.dateTime as string).valueOf() /
                        1000
                    }> to <t:${
                        new Date(event.end?.dateTime as string).valueOf() / 1000
                    }:t>`
                },
                {
                    name: 'Location',
                    value: event.location ?? 'N/A'
                },
            ];

            const embed = new EmbedBuilder()
                .setColor('Blue')
                .setTitle(event.summary ?? 'N/A')
                .setDescription(event.description || ' ')
                .setFields(...fields)
                .setThumbnail(
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Google_Calendar_icon_%282020%29.svg/1024px-Google_Calendar_icon_%282020%29.svg.png?20221106121915'
                );
            channel
                .send({
                    content: `${rolesIds
                        .map((roleId) => `<@&${roleId}>`)
                        .join(' ')}\n${message}`,
                    embeds: [embed]
                })
                .then(() => client.destroy());
        })
        .catch((e) => {
            Logging.error(e)
            client.destroy();
        });
}

export default announceEvent