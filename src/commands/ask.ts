import {
    ChannelType,
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder
} from 'discord.js';
import { client } from '../bot';
import gdscColor from '../library/colours';
import Logging from '../library/Logging';

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
    try {
        if (!interaction?.channelId) return;
    
        const channel = await client.channels.fetch(interaction.channelId);
        if (!channel || channel.type !== ChannelType.GuildText) return;
    
        const embed = new EmbedBuilder()
            .setColor(gdscColor())
            .setTitle(interaction.options.getString('question'))
    
        // const message = await interaction.channel!.send({ embeds: [embed] });
        
        const poll = await interaction.reply({
            embeds: [embed],
            fetchReply: true
        });

        await poll.react('✅');
        await poll.react('❌');

    } catch (e) {
        Logging.error(e)
    }
}
