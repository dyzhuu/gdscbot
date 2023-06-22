import {
    APIEmbedField,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder
} from 'discord.js';
import sheets from '../../services/googleSheetsAPI';
import Logging from '../../library/Logging';

export const data = new SlashCommandBuilder()
    .setName('exec')
    .setDescription('Retrieves executive details from the google sheet')
    .addUserOption((option) =>
        option
            .setName('username')
            .setDescription(
                "Enter the username of the exec of whom's details to get"
            )
            .setRequired(true)
    );

export async function execute(interaction: ChatInputCommandInteraction) {
    try {
        const username = interaction.options.getUser('username')!.username;

        const exec = (await sheets.getExec(9, username))![0];

        const fields: APIEmbedField[] = [
            { name: 'Role: ', value: exec.role },
            { name: 'Email: ', value: exec.email },
            { name: 'Phone Number: ', value: exec.phoneNumber }
        ];

        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setFields(fields)
            .setTitle(exec.name)
            .setThumbnail(
                interaction.options.getUser('username')!.displayAvatarURL()
            );
        interaction.reply({ embeds: [embed] });
    } catch (error) {
        Logging.error(error);
    }
}
