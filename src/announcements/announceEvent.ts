import {
    Client,
    TextChannel,
    EmbedBuilder,
    GatewayIntentBits
} from 'discord.js';

import Logging from '../library/Logging';
import { calendar_v3 } from 'googleapis';
import config from '../config';

export default async function announceEvent(event: calendar_v3.Schema$Event) {
    const channelId = '1113381023296790571';
    const rolesIds = ['1121715988006711337', '1121716021372395522'];

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

            //TODO: better embed text
            const embed = new EmbedBuilder()
                .setColor('Blue')
                .setTitle(event.summary! + event.start!.dateTime);

            channel
                .send({
                    content: `${rolesIds
                        .map((roleId) => `<@&${roleId}>`)
                        .join(' ')}`,
                    embeds: [embed]
                })
                .then(() => client.destroy());
        })
        .catch((e) => {
            Logging.error(e);
            client.destroy();
        });
}
