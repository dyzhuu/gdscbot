import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
} from 'discord.js';
import sheets from '../../middleware/GoogleSheetsAPI'
import Logging from '../../library/Logging';

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
        option.setName('shirt_size')
        .setDescription('Enter your shirt size')
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

export async function execute(
    interaction: ChatInputCommandInteraction) {

    const values: string[] = interaction.options.data.map(x => x.value as string);
    values.splice(4)

    let execProfile = sheets.dboToObject(
        [...values,
        interaction.options.getString('dietary_requirements') ?? '',
        interaction.options.getString('shirt_size') ?? '',
        interaction.options.getString('year_graduating') ?? '',
        interaction.options.getString('degree') ?? '']
    );
    
    return await sheets.createExec(execProfile)
        .then(() => {
            interaction.reply({
                content: `Details added into google sheets database:\n\`\`\`${Object.entries(execProfile)
                .map((x) => x.join(': '))
                .join('\n')}\`\`\``,
                ephemeral: true
            });
        })
        .catch((error) => {
            Logging.error(error);
            interaction.reply({
                content: 'Failed to add details into database',
                ephemeral: true
            });
        });
}
