import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
    APIEmbedField
} from 'discord.js';
import fs from 'fs';
import sheets from '../../services/googleSheetsAPI';
import Logging from '../../library/Logging';

// const filterChoices = JSON.parse(fs.readFileSync('names.txt').toString()).map((choice: string) => ({ name: choice, value: choice }));

// const execNames = fs.readFileSync('names.txt').toString()

export const data = new SlashCommandBuilder()
    .setName('getexec')
    .setDescription('Retrieves executive details from the google sheet')
    .addStringOption(
        (option) =>
            option
                .setName('name')
                .setDescription(
                    'Enter the name of the exec whose details to get'
                )
                .setRequired(true)
                .setAutocomplete(true)
        // .setChoices(...filterChoices)
    );

export async function autocomplete(interaction: AutocompleteInteraction) {
    const focusedValue = interaction.options.getFocused();
    const choices: string[] = JSON.parse(
        fs.readFileSync('names.txt').toString()
    );
    const filtered = choices.filter((choice) =>
        choice.toLowerCase().includes(focusedValue.toLowerCase())
    );
    await interaction.respond(
        filtered.map((choice) => ({ name: choice, value: choice }))
    );
}

export async function execute(interaction: ChatInputCommandInteraction) {
    try {
        const name = interaction.options
            .getString('name')!
            .split(' ')
            .map((x) => x.charAt(0).toUpperCase() + x.slice(1))
            .join(' ');
        const exec = (await sheets.getExec(1, name))![0];

        const fields: APIEmbedField[] = [
            { name: 'Role: ', value: exec.role },
            { name: 'Email: ', value: exec.email },
            { name: 'Phone Number: ', value: exec.phoneNumber }
        ];

        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setFields(fields)
            .setTitle(name);

        return interaction.reply({ embeds: [embed] });
    } catch (e) {
        Logging.error(e)
        const embed = new EmbedBuilder()
            .setColor('Red')
            .setTitle('Error getting exec details')
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }
}
