import {
  Client,
  TextChannel,
  EmbedBuilder,
  GatewayIntentBits
} from 'discord.js';

import Logging from '../library/Logging';
import config from '../config';

async function weeklySync() {
  const channelId = config.SYNC_CHANNEL_ID;
  const rolesIds = config.PING_ROLE_IDS.split(' ');

  const client = new Client({ intents: GatewayIntentBits.Guilds });
  client
    .login(config.TOKEN)
    .then(async () => {
      const channel = (await client.channels.fetch(channelId)) as TextChannel;
      if (!channel) {
        Logging.error(`Channel ${channelId} does not exist`);
      }

      channel
        .send({
          content: `${rolesIds
            .map((roleId) => `<@&${roleId}>`)
            .join(' ')} Weekly sync now!`
        })
        .then(() => client.destroy());
    })
    .catch((e) => {
      Logging.error(e);
      client.destroy();
    });
}

export default weeklySync;
