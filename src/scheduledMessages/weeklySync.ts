import {
    Client,
    TextChannel,
    EmbedBuilder,
    GatewayIntentBits
} from 'discord.js';

import Logging from '../library/Logging';
import config from '../config';

export default async function weeklySync() {
    const channelId = '1113381023296790571';
    const rolesIds = ['1121715988006711337', '1121716021372395522'];
    const meetingTime = new Date().setHours(19, 30, 0, 0).valueOf() / 1000

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

                // const embed = new EmbedBuilder()
                // .setColor('Blue')
                // .setTitle(``);

            channel
                .send({
                    content: `${rolesIds
                        .map((roleId) => `<@&${roleId}>`)
                        .join(' ')} Weekly sync <t:${meetingTime}:R>!`,
                })
                .then(() => client.destroy());
        })
        .catch((e) => {
            Logging.error(e);
            client.destroy();
        });
}
