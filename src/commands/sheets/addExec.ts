import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
    APIEmbedField
} from 'discord.js';
import sheets from '../../services/googleSheetsAPI';
import Logging from '../../library/Logging';
import googleColor from '../../library/colours';
import { roleChoices } from '../../library/constants';

export const data = new SlashCommandBuilder()
    .setName('addexec')
    .setDescription('Adds an executive to the google sheet')
    .addStringOption((option) =>
        option
            .setName('name')
            .setDescription('Enter your full name')
            .setRequired(true)
    )
    .addStringOption((option) =>
        option
            .setName('role')
            .setDescription('Enter your role')
            .setChoices(...roleChoices)
            .setRequired(true)
    )
    .addStringOption((option) =>
        option
            .setName('email')
            .setDescription('Enter your preferred email address')
            .setRequired(true)
    )
    .addStringOption((option) =>
        option
            .setName('phone_number')
            .setDescription('Enter your phone number')
            .setRequired(true)
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

export async function execute(interaction: ChatInputCommandInteraction) {
    const values: string[] = interaction.options.data.map(
        (x) => x.value as string
    );
    values.splice(4);

    let exec = sheets.dboToObject([
        ...values,
        interaction.options.getString('dietary_requirements') ?? '-',
        interaction.options.getString('shirt_size') ?? '-',
        interaction.options.getString('year_graduating') ?? '-',
        interaction.options.getString('degree') ?? '-'
    ]);

    exec.name = exec.name
        .toLowerCase()
        .split(' ')
        .map((x: string) => x.charAt(0).toUpperCase() + x.slice(1))
        .join(' ');

    const remainingFields = [
        { name: 'Dietary Requirements', value: exec.dietaryRequirements },
        { name: 'Shirt Size', value: exec.shirtSize },
        { name: 'Year Graduating', value: exec.yearGraduating },
        { name: 'Degree', value: exec.degree }
    ].filter((field) => field.value !== '-');

    const fields: APIEmbedField[] = [
        { name: 'Role: ', value: exec.role },
        { name: 'Email: ', value: exec.email },
        { name: 'Phone Number: ', value: exec.phoneNumber },
        ...remainingFields
    ];

    const embed = new EmbedBuilder()
        .setColor(googleColor())
        .setFields(fields)
        .setTitle(exec.name);

    try {
        await sheets.createExec(exec);
        Logging.info(exec);
        interaction.reply({
            content: 'Details added into google sheets database:',
            embeds: [embed],
            ephemeral: true
        });
    } catch (e) {
        Logging.error(e);
        const embed = new EmbedBuilder()
            .setColor('#DB4437')
            .setTitle('Error adding details into database');
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }
}
