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
import Exec from '../../models/Exec';

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
      .setName('preferred_email')
      .setDescription('Enter your preferred email address')
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName('university_email')
      .setDescription('Enter your university email address')
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
      .setName('account_number')
      .setDescription(
        'Enter your bank account number for reimbursement purposes'
      )
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
      .setName('year_of_study')
      .setDescription('Enter your current year of study')
  )
  .addStringOption((option) =>
    option
      .setName('degree')
      .setDescription(
        'Enter the name of the degree you are current studying towards'
      )
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  let exec: Exec = {
    name: interaction.options.getString('name')!,
    role: interaction.options.getString('role')!,
    preferredEmail: interaction.options.getString('preferred_email')!,
    universityEmail: interaction.options.getString('university_email')!,
    phoneNumber: interaction.options.getString('phone_number')!,
    accountNumber: interaction.options.getString('account_number') ?? '-',
    dietaryRequirements:
      interaction.options.getString('dietary_requirements') ?? '-',
    shirtSize: interaction.options.getString('shirt_size') ?? '-',
    yearOfStudy: interaction.options.getString('year_of_study') ?? '-',
    degree: interaction.options.getString('degree') ?? '-'
  };

  exec.name = exec.name
    .toLowerCase()
    .split(' ')
    .map((x: string) => x.charAt(0).toUpperCase() + x.slice(1))
    .join(' ');

  const remainingFields = [
    { name: 'Dietary Requirements', value: exec.dietaryRequirements },
    { name: 'Shirt Size', value: exec.shirtSize },
    { name: 'Current Year of Study', value: exec.yearOfStudy },
    { name: 'Degree', value: exec.degree }
  ].filter((field) => field.value !== '-');

  const fields: APIEmbedField[] = [
    { name: 'Role: ', value: exec.role },
    { name: 'Email: ', value: exec.preferredEmail },
    { name: 'Phone Number: ', value: exec.phoneNumber },
    { name: 'Account Number', value: exec.accountNumber },
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
