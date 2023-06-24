import {
    APIEmbedField,
    ChannelType,
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder
} from 'discord.js';
import { client } from '../bot';

export const data = new SlashCommandBuilder()
    .setName('ask')
    .setDescription('Creates a yes/no poll')
    .addStringOption((option) =>
        option
            .setName('question')
            .setDescription('Provide the question here')
            .setRequired(true)
    );

export async function execute(interaction: ChatInputCommandInteraction) {
    if (!interaction?.channelId) return;

    const channel = await client.channels.fetch(interaction.channelId);
    if (!channel || channel.type !== ChannelType.GuildText) return;

    const embed = new EmbedBuilder()
        .setColor('Blue')
        .setTitle(interaction.options.getString('question'))
        .setTimestamp();

    const message = await interaction.channel!.send({ embeds: [embed] });

    await message.react('✅');
    await message.react('❌');

    return interaction.reply({
        content: 'Poll created!',
        ephemeral: true
    });
}
