import {
  APIEmbedField,
  ChannelType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder
} from 'discord.js';
import { client } from '../bot';
import googleColor from '../library/colours';
import Logging from '../library/Logging';
import { number_emojis } from '../library/constants';

export const data = new SlashCommandBuilder()
  .setName('embed')
  .setDescription('Creates an embed')
  .addStringOption((option) =>
    option
      .setName('title')
      .setDescription('Provide the title text')
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName('description')
      .setDescription('Provide the description content')
      .setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  try {
    if (!interaction?.channelId) return;

    const channel = await client.channels.fetch(interaction.channelId);
    if (!channel || channel.type !== ChannelType.GuildText) return;

    const embed = new EmbedBuilder()
      .setColor(googleColor())
      .setTitle(interaction.options.getString('title'))
      .setDescription(interaction.options.getString('description'));

    return interaction.reply({
      embeds: [embed],
      fetchReply: true
    });
  } catch (e) {
    Logging.error(e);
  }
}
