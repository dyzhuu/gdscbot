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
import googleColor from '../../library/colours';
import Exec from '../../models/Exec';

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
  .addBooleanOption((option) =>
    option
      .setName('extended')
      .setDescription('Get extended information about the exec')
  );

export async function autocomplete(interaction: AutocompleteInteraction) {
  const focusedValue = interaction.options.getFocused();
  const choices: string[] = JSON.parse(fs.readFileSync('names.txt').toString());
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
    // .split(' ')
    // .map((x) => x.charAt(0).toUpperCase() + x.slice(1))
    // .join(' ');
    const exec: Exec = (await sheets.getExec(1, name))![0];

    console.log(exec);

    const fields: APIEmbedField[] = [
      { name: 'Role: ', value: exec.role },
      { name: 'Email: ', value: exec.email },
      { name: 'Phone Number: ', value: exec.phoneNumber },
      {
        name: 'Account Number',
        value: exec.accountNumber ? exec.accountNumber : '-'
      }
    ];

    if (interaction.options.getBoolean('extended')) {
      const remainingFields = [
        {
          name: 'Dietary Requirements',
          value: exec.dietaryRequirements ? exec.dietaryRequirements : '-'
        },
        {
          name: 'Shirt Size',
          value: exec.shirtSize ? exec.shirtSize : '-'
        },
        {
          name: 'Current Year of Study',
          value: exec.yearOfStudy ? exec.yearOfStudy : '-'
        },
        { name: 'Degree', value: exec.degree ? exec.degree : '-' }
      ];

      fields.push(...remainingFields);
    }

    const embed = new EmbedBuilder()
      .setColor(googleColor())
      .setFields(fields)
      .setTitle(name);
    return interaction.reply({ embeds: [embed], ephemeral: true });
  } catch (e) {
    Logging.error(e);
    const embed = new EmbedBuilder()
      .setColor('#DB4437')
      .setTitle('Error getting exec details');
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
}
