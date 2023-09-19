import {
    APIActionRowComponent,
    APIMessageActionRowComponent,
    ActionRowBuilder,
    AutocompleteInteraction,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChannelType,
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder
} from 'discord.js';
import { client } from '../bot';
import googleColor from '../library/colours';
import Logging from '../library/Logging';
import fs from 'fs';
import sheets from '../services/googleSheetsAPI';
import Exec from '../models/Exec';

export const data = new SlashCommandBuilder()
    .setName('reimburse')
    .setDescription('Ask for a reimbursement')
    .addStringOption((option) =>
        option
            .setName('name')
            .setDescription('Enter the person to reimburse here')
            .setRequired(true)
            .setAutocomplete(true)
    )
    .addNumberOption((option) =>
        option
            .setName('amount')
            .setDescription('Enter the amount to reimburse here')
            .setRequired(true)
    )
    .addAttachmentOption((option) =>
        option
            .setName('receipt')
            .setDescription('Attach an image of the receipt here')
            .setRequired(true)
    )
    .addStringOption((option) => {
        return option
            .setName('comments')
            .setDescription('Enter comments about the reimbursement here');
    });

export async function autocomplete(interaction: AutocompleteInteraction) {
    const focusedValue = interaction.options.getFocused();
    const choices: string[] = JSON.parse(
        fs.readFileSync('names.txt').toString()
    );
    const filtered = choices.filter((choice) =>
        choice.toLowerCase().includes(focusedValue.toLowerCase())
    );
    await interaction.respond(
        filtered.map((choice) => ({ name: choice, value: choice }))
    );
}

export async function execute(interaction: ChatInputCommandInteraction) {
    try {
        if (!interaction?.channelId) return;

        const channel = await client.channels.fetch(interaction.channelId);
        if (!channel || channel.type !== ChannelType.GuildText) return;

        const name = interaction.options.getString('name')!;
        const amount = interaction.options.getNumber('amount')!;
        const comments = interaction.options.getString('comments')!;

        const exec: Exec = (await sheets.getExec(1, name))![0];

        if (!exec.accountNumber) {
            return interaction.reply({
                content:
                    'Please add your account number to the sheet first with `/updateexec`',
                ephemeral: true
            });
        }

        const approve = new ButtonBuilder()
            .setCustomId('approve')
            .setLabel('Appove Reimbursement')
            .setStyle(ButtonStyle.Success);

        const deny = new ButtonBuilder()
            .setCustomId('deny')
            .setLabel('Deny Reimbursement')
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            approve,
            deny
        );

        const embed = new EmbedBuilder()
            .setColor(googleColor())
            .setTitle('Reimbursement bill for ' + name)
            .setDescription(
                `\`$${amount}\` to be paid into \`${exec.accountNumber}\``
            )
            .setImage(interaction.options.getAttachment('receipt')!.url);

        if (comments) {
            embed.addFields({
                name: 'Comments',
                value: interaction.options.getString('comments')!
            });
        }
        await interaction.reply({
            embeds: [embed],
            components: [row]
        });
    } catch (e) {
        Logging.error(e);
    }
}

export async function executeButton(interaction: ButtonInteraction) {
    const { customId } = interaction;
    const targetMember = interaction.guild?.members.cache.get(
        interaction.user.id
    );
    const memberName = targetMember?.nickname ?? interaction.user.username;
    //TODO: update with actual ids
    // 754995339391533079

    if (
        !(
            targetMember?.roles.cache.has('1153718950480330883') ||
            targetMember?.roles.cache.has('1121715988006711337')
        )
    ) {
        return interaction.reply({
            content: 'You do not have permission to do this',
            ephemeral: true
        });
    }
    const originalEmbed = interaction.message.embeds[0];
    if (customId === 'approve') {
        const confirmPaid = new ButtonBuilder()
            .setCustomId('confirmPaid')
            .setLabel('Confirm Paid')
            .setStyle(ButtonStyle.Primary);
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            confirmPaid
        );
        const newEmbed = new EmbedBuilder()
            .setColor(googleColor('green'))
            .setTitle(originalEmbed.title + ' - Approved')
            .setDescription(originalEmbed.description);
        newEmbed.addFields(originalEmbed.fields);
        newEmbed.setImage(originalEmbed.image!.url);
        newEmbed.setFooter({
            text: `Reimbursement approved by ${memberName}`
        });
        interaction.update({
            embeds: [newEmbed],
            components: [row]
        });
    } else if (customId === 'deny') {
        const deny = new ButtonBuilder()
            .setCustomId('deny')
            .setLabel('Reimbursement Denied')
            .setStyle(ButtonStyle.Danger)
            .setDisabled(true);
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(deny);
        const newEmbed = new EmbedBuilder()
            .setColor(googleColor('red'))
            .setTitle(originalEmbed.title + ' - Denied')
            .setDescription(originalEmbed.description);
        newEmbed.addFields(originalEmbed.fields);
        newEmbed.setImage(originalEmbed.image!.url);
        newEmbed.setFooter({ text: `Reimbursement denied by ${memberName}` });
        interaction.update({
            embeds: [newEmbed],
            components: [row]
        });
    } else if (customId === 'confirmPaid') {
        const paid = new ButtonBuilder()
            .setCustomId('paid')
            .setLabel('Paid')
            .setStyle(ButtonStyle.Success)
            .setDisabled(true);
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(paid);
        interaction.update({
            components: [row]
        });
    }
}
