import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import gdscColor from '../library/colours';

export const data = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Guide on how to use to bot!');

export async function execute(interaction: CommandInteraction) {
    
    const embed = new EmbedBuilder()
        .setColor(gdscColor())
        .setTitle('How to use the GDSC Bot')
        .setFields(
            {
                name: 'General Commands',
                value: '`/ask`: creates a poll with ✅/❌  \n`/poll`: creates a multi-choice poll '
            },
            {
                name: 'Information Commands',
                value: "`/get`: Retrieve someone's details from the google sheet\n`/add`: Add your information to the google sheet\n`/update`: Update your information in the google sheet"
            }
        );
        ;

    return interaction.reply({embeds: [embed], ephemeral: true});
}
