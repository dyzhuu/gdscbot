import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import * as calendar from '../services/googleCalendarAPI';

export const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!');

export async function execute(interaction: CommandInteraction) {
    calendar.listCreatedEvents();
    return interaction.reply('Pong!');
}
