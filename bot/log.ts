import { EmbedBuilder, TextChannel } from 'discord.js';
import client from '.';

const targetChannel = process.env.DISCORD_LOGGING_CHANNEL;

export default async function (success: boolean, msg: string) {
	if (!targetChannel || targetChannel === undefined || targetChannel === '') return;

	const embed = new EmbedBuilder()
		.setDescription(msg)
		.setColor(success ? 'Green' : 'Red')
		.setTitle(success ? 'Message successfully sent' : 'Error');

	try {
		const channel = await client.channels.fetch(targetChannel) as TextChannel;
		await channel?.send({ embeds: [embed] });
	} catch (error) {
		console.error('Error sending message:', error);
	}
}
