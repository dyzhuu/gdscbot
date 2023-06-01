import { REST, Routes, SlashCommandAssertions, SlashCommandBuilder } from 'discord.js'
import config from './config'
import * as commandModules from "./commands"

type Command = {
    data: unknown
}

const commands = [];

for (const module of Object.values<Command>(commandModules)) {
    commands.push(module.data)
}

const rest = new REST().setToken(config.TOKEN);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data: any = await rest.put(
			Routes.applicationGuildCommands(config.CLIENT_ID, config.GUILD_ID),
			{ body: commands },
		);

		console.log(`Successfully registered ${data.length} application (/) commands.`);
	} catch (e) {
		console.error(e);
	}
})();
