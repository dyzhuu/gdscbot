import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
    APIEmbedField
} from 'discord.js';
import fs from 'fs';
import sheets from '../../services/googleSheetsAPI';
import Exec from '../../models/Exec';
import googleColor from '../../library/colours';
import { roleChoices } from '../../library/constants';

export const data = new SlashCommandBuilder()
    .setName('updateexec')
    .setDescription('Upates executive details from the google sheet')
    .addStringOption((option) =>
        option
            .setName('name')
            .setDescription(
                'Enter the name of the exec whose details to update'
            )
            .setRequired(true)
            .setAutocomplete(true)
    )
    .addStringOption((option) =>
        option
            .setName('role')
            .setDescription('Enter your role')
            .setChoices(...roleChoices)
    )
    .addStringOption((option) =>
        option
            .setName('email')
            .setDescription('Enter your preferred email address')
    )
    .addStringOption((option) =>
        option.setName('phone_number').setDescription('Enter your phone number')
    )
    .addStringOption((option) =>
        option
            .setName('dietary_requirements')
            .setDescription(
                'Enter your dietary requirements if any, (leave blank if none)'
            )
    )
    .addStringOption((option) =>
        option.setName('shirt_size').setDescription('Enter your shirt size')
    )
    .addStringOption((option) =>
        option
            .setName('year_graduating')
            .setDescription('Enter your graduating year')
    )
    .addStringOption((option) =>
        option
            .setName('degree')
            .setDescription(
                'Enter the name of the degree you are current studying towards'
            )
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
        const name = interaction.options.getString('name')!;
        const exec: Exec = (await sheets.getExec(1, name))![0];
        const updatedExec: Exec = sheets.dboToObject([
            name,
            interaction.options.getString('role') ?? exec.role,
            interaction.options.getString('email') ?? exec.email,
            interaction.options.getString('phone_number') ?? exec.phoneNumber,
            interaction.options.getString('dietary_requirements') ??
                exec.dietaryRequirements,
            interaction.options.getString('shirt_size') ?? exec.shirtSize,
            interaction.options.getString('year_graduating') ??
                exec.yearGraduating,
            interaction.options.getString('degree') ?? exec.degree
        ]);

        await sheets.updateExec(updatedExec);

        const fields: APIEmbedField[] = Object.entries(updatedExec)
            .filter((x) => x[1] !== exec[x[0] as keyof typeof exec])
            .map((x) => ({
                name: `${x[0].charAt(0).toUpperCase() + x[0].slice(1)}: `,
                value: `${exec[x[0] as keyof typeof exec]} → ${x[1]}`
            }));

        const embed = new EmbedBuilder()
            .setColor(googleColor())
            .setFields(fields)
            .setTitle(`Updated Details for ${name}`);

        return interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
        const embed = new EmbedBuilder()
            .setColor('#DB4437')
            .setTitle('Failed to update details');
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }
}
