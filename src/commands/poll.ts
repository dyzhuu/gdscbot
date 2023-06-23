import {
    APIEmbedField,
    ChannelType,
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder
} from 'discord.js';
import { client } from '../bot';

const number_emojis = {
    1: '1️⃣',
    2: '2️⃣',
    3: '3️⃣',
    4: '4️⃣',
    5: '5️⃣'
};

export const data = new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Creates a poll')
    .addStringOption((option) =>
        option
            .setName('question')
            .setDescription('Provide the question here')
            .setRequired(true)
    )
    .addStringOption((option) =>
        option
            .setName('option1')
            .setDescription('Provide the first polling option here')
            .setRequired(true)
    )
    .addStringOption((option) =>
        option
            .setName('option2')
            .setDescription('Provide the second polling option here')
            .setRequired(true)
    )
    .addStringOption((option) =>
        option
            .setName('option3')
            .setDescription('Provide the third polling option here')
    )
    .addStringOption((option) =>
        option
            .setName('option4')
            .setDescription('Provide the fourth polling option here')
    )
    .addStringOption((option) =>
        option
            .setName('option5')
            .setDescription('Provide the fifth polling option here')
    );

export async function execute(interaction: ChatInputCommandInteraction) {
    if (!interaction?.channelId) {
        return;
    }

    const channel = await client.channels.fetch(interaction.channelId);
    if (!channel || channel.type !== ChannelType.GuildText) {
        return;
    }

    const fields: APIEmbedField[] = interaction.options.data
        .map((x, index) => {
            return {
                name: `${
                    number_emojis[index as keyof typeof number_emojis]
                } : ${x.value}`,
                value: '\n'
            };
        })
        .slice(1);

    const embed = new EmbedBuilder()
        .setColor('Blue')
        .setTitle(interaction.options.getString('question'))
        .setFields(fields)
        .setTimestamp();

    const message = await interaction.channel!.send({ embeds: [embed] });

    for (let i = 1; i <= fields.length; i++) {
        await message.react(
            `${number_emojis[i as keyof typeof number_emojis]}`
        );
    }

    return interaction.reply({
        content: 'Poll created!',
        ephemeral: true
    });
}
