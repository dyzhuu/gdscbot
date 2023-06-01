import { REST, Routes, SlashCommandAssertions, SlashCommandBuilder } from 'discord.js'
import config from './config'
import * as commandModules from "./commands"

type Command = {
    data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
}

const commands = [];

for (const module of Object.values<Command>(commandModules)) {
    commands.push(module.data)
}

const rest = new REST().setToken(config.TOKEN);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// rest.put(Routes.applicationGuildCommands(config.CLIENT_ID, config.GUILD_ID), { body: [] })
		// .then(() => console.log('Successfully deleted all guild commands.'))
		// .catch(console.error);

		const data = <Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">[]> await rest.put(
			Routes.applicationGuildCommands(config.CLIENT_ID, config.GUILD_ID),
			{ body: commands },
		);
		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (e) {
		console.error(e);
	}
})();
