import {
    Client,
    TextChannel,
    EmbedBuilder,
    GatewayIntentBits
} from 'discord.js';

import Logging from '../library/Logging';
import config from '../config';
import googleColor from '../library/colours';
import { calendar_v3 } from 'googleapis';

async function weeklySync(event: calendar_v3.Schema$Event) {
    const channelId = config.SYNC_CHANNEL_ID;
    const rolesIds = config.PING_ROLE_IDS.split(' ');
    const meetingTime =
        new Date(event.start?.dateTime as string).setSeconds(0, 0).valueOf() /
        1000;

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

            const embed = new EmbedBuilder()
                .setColor(googleColor())
                .setDescription(`Weekly sync <t:${meetingTime}:R>!`);

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

export default weeklySync;
