import { Client, GatewayIntentBits, TextChannel, EmbedBuilder } from 'discord.js';
import config from '../config';
import Logging from '../library/Logging';

export const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.login(config.TOKEN).then(async () => {
    const channelId = '1113381023296790571';
    const rolesIds = ['1121715988006711337', '1121716021372395522'];
    try {
        const channel = (await client.channels.fetch(channelId)) as TextChannel;
        if (!channel) {
            Logging.error(`Channel ${channelId} does not exist`);
        }

        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('Weekly sync meeting in 1 hour!');

        channel
            .send({
                content: `${rolesIds.map((roleId) => `<@&${roleId}>`).join(" ")}`,
                embeds: [embed]
            })
            .then(() => client.destroy());
    } catch (e) {
        Logging.error(e);
        client.destroy();
    }
})