import {
  REST,
  Routes,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder
} from 'discord.js';
import config from './config';
import * as commandModules from './commands';
import Logging from './library/Logging';

const commands: Array<SlashCommandBuilder | SlashCommandOptionsOnlyBuilder> =
  [];

const commandModulesObject = Object.values(commandModules) as Array<{
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
}>;

for (const module of commandModulesObject) {
  commands.push(module.data);
}

const rest = new REST().setToken(config.TOKEN);

(async () => {
  try {
    Logging.info(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // rest.put(Routes.applicationGuildCommands(config.CLIENT_ID, config.GUILD_ID), { body: [] })
    // .then(() => console.log('Successfully deleted all guild commands.'))
    // .catch(console.error);

    const data = (await rest.put(
      Routes.applicationGuildCommands(config.CLIENT_ID, config.GUILD_ID),
      { body: commands }
    )) as Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>[];

    Logging.info(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
    process.exit(0);
  } catch (e) {
    Logging.error(e);
  }
})();
