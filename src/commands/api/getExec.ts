import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
} from 'discord.js';
import sheets from '../../middleware/GoogleSheetsAPI'
import dotenv from 'dotenv';
dotenv.config()

const filterChoices = [
    { name: 'name', value: 'name' },
    { name: 'role', value: 'role' },
    { name: 'dietary requirements', value: 'dietaryRequirements' },
    { name: 'shirt size', value: 'shirtSize' },
    { name: 'year graduating', value: 'yearGraduating' },
];

const convertToColumn = {
    name: 1,
    role: 2,
    dietaryRequirements: 5,
    shirtSize: 6,
    yearGraduating: 7
}

export const data = new SlashCommandBuilder()
    .setName('getexec')
    .setDescription('Retrieves executive details from the google sheet')
    .addStringOption((option) =>
        option
            .setName('filter')
            .setDescription('Set the category to filter by')
            .setChoices(...filterChoices)
    )
    .addStringOption((option) =>
        option
            .setName('value')
            .setDescription('Enter the value you would like to filter for')
    )

export async function execute(
    interaction: ChatInputCommandInteraction) {

    let filter = interaction.options.getString('filter') as 'name' | 'role' | 'dietaryRequirements' | 'shirtSize' | 'yearGraduating' | null
    const value = interaction.options.getString('value')

    if (filter && value) {
            const exec = await sheets.getExec(convertToColumn[filter], value)

            if (exec) {
                    interaction.reply({
                    content: `${exec.map((profile) => `\`\`\`${Object.entries(profile).map(x => x.join(': ')).join('\n')}\`\`\``)}`,
                    ephemeral: true
                });
                }
    } else {
        return
    }
}