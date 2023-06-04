import { ChannelType, ChatInputApplicationCommandData, ChatInputCommandInteraction, Client, CommandInteraction, SlashCommandBuilder, TextChannel } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("help")
    .setDescription("Creates a new help ticket")
    .addStringOption( option => 
        option
            .setName("description")
            .setDescription("Describe your problem")
            .setRequired(true)
        )

export async function execute(interaction: ChatInputCommandInteraction, client: Client) {
    if (!interaction?.channelId){
        return
    }

    const channel = await client.channels.fetch(interaction.channelId)
    if (!channel || channel.type !== ChannelType.GuildText) {
        return
    }

    const thread = await (channel as TextChannel).threads.create({
        name: `support-${(Date.now())}`,
        reason: `Support ticket ${(Date.now())}`,
    })

    const problemDescription = interaction.options.getString("description");
    const { user } = interaction;
    thread.send(`**User:** <${user}>
**Problem:** ${problemDescription}`)

    return interaction.reply({
        content: "Help is on the way!",
        ephemeral: true,
    })
};