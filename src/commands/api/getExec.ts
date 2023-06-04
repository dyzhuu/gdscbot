import {
    Application,
    ApplicationCommand,
    ApplicationCommandAutocompleteStringOption,
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
} from 'discord.js';
import sheets from '../../middleware/GoogleSheetsAPI'
import fs from 'fs'

// const filterChoices = [
//     { name: 'name', value: 'name' },
//     { name: 'role', value: 'role' },
//     { name: 'dietary requirements', value: 'dietaryRequirements' },
//     { name: 'shirt size', value: 'shirtSize' },
//     { name: 'year graduating', value: 'yearGraduating' },
// ];

// const convertToColumn = {
//     name: 1,
//     role: 2,
//     dietaryRequirements: 5,
//     shirtSize: 6,
//     yearGraduating: 7
// }


export const data = new SlashCommandBuilder()
    .setName('getexec')
    .setDescription('Retrieves executive details from the google sheet')
    .addStringOption((option) =>
        option
            .setName('name')
            .setDescription('Enter the name of the exec whose details to get')
            .setRequired(true)
            .setAutocomplete(true)
    )

export async function autocomplete(interaction: AutocompleteInteraction) {
    const focusedValue = interaction.options.getFocused();
    const choices:string[] = JSON.parse(fs.readFileSync('names.txt').toString());
    const filtered = choices.filter(choice => choice.startsWith(focusedValue));
    await interaction.respond(
        filtered.map(choice => ({ name: choice, value: choice }))
    );
}

export async function execute(
    interaction: ChatInputCommandInteraction) {
        const name = interaction.options.getString('name')
        interaction.reply({content: `${name}`})
    }
