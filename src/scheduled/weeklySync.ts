import { Client, TextChannel, EmbedBuilder, GatewayIntentBits } from 'discord.js';

import Logging from '../library/Logging';

export default async function weeklySync(client: Client) {
    const channelId = '1113381023296790571';
    const rolesIds = ['1121715988006711337', '1121716021372395522'];
    try {
        const channel = (await client.channels.fetch(channelId)) as TextChannel;
        if (!channel) {
            Logging.error(`Channel ${channelId} does not exist`);
        }

        //TODO: better embed text
        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('Weekly sync meeting in 1 hour!' + new Date());

        channel
            .send({
                content: `${rolesIds.map((roleId) => `<@&${roleId}>`).join(" ")}`,
                embeds: [embed]
            })
            // .then(() => client.destroy());
    } catch (e) {
        Logging.error(e);
    }
}

// const c = new Client ({ intents: GatewayIntentBits.Guilds})
// c.login(config.TOKEN).then(async () => {
//     await weeklySync(c)
//     c.destroy
// })