import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
    APIEmbedField
} from 'discord.js';
import sheets from '../../services/googleSheetsAPI';
import Logging from '../../library/Logging';
import gdscColor from '../../library/colours';

const roleChoices = [
    { name: 'General Executive 💼', value: 'General Executive' },
    { name: 'Marketing Executive 📈💡', value: 'Marketing Executive' },
    { name: 'Secretary 📝👤', value: 'Secretary' },
    { name: 'Treasurer 💰📊', value: 'Treasurer' }
];

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
        interaction.options.getString('dietary_requirements') ?? 'N/A',
        interaction.options.getString('shirt_size') ?? 'N/A',
        interaction.options.getString('year_graduating') ?? 'N/A',
        interaction.options.getString('degree') ?? 'N/A'
    ]);

    exec.name = exec.name
        .toLowerCase()
        .split(' ')
        .map((x: string) => x.charAt(0).toUpperCase() + x.slice(1))
        .join(' ');

    const fields: APIEmbedField[] = [
        { name: 'Role: ', value: exec.role },
        { name: 'Email: ', value: exec.email },
        { name: 'Phone Number: ', value: exec.phoneNumber },
        { name: 'Dietary Requirements', value: exec.dietaryRequirements },
        { name: 'Shirt Size', value: exec.shirtSize },
        { name: 'Year Graduating', value: exec.yearGraduating },
        { name: 'Degree', value: exec.degree }
    ];

    const embed = new EmbedBuilder()
        .setColor(gdscColor())
        .setFields(fields)
        .setTitle(exec.name);
    // .setThumbnail(interaction.user.displayAvatarURL());

    try {
        await sheets.createExec(exec)
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
            .setTitle('Error')
            .setDescription('Error adding details into database');
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }
}
