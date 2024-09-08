import { Events, EmbedBuilder, TextChannel } from 'discord.js';
import client from '../index';
import { removeGuild } from '../database';

client.on(Events.GuildDelete, async guild => {
	try {
		// Send a message to the logging channel
		const embedLoggingChannel = new EmbedBuilder()
			.setTitle("Left Guild :<")
			.setColor('Blurple')
			.setDescription(`Left guild: **${guild.name}**`)
			.setThumbnail(guild.iconURL())
			.addFields({ name: 'Guild ID', value: guild.id, inline: true })

		const loggingChannelId = process.env.DISCORD_LOGGING_CHANNEL;
		if (!loggingChannelId) {
			throw new Error('DISCORD_LOGGING_CHANNEL environment variable is not defined.');
		}

		const channel = await client.channels.fetch(loggingChannelId) as TextChannel;
		await channel?.send({ embeds: [embedLoggingChannel] });
		removeGuild(guild.id);

	} catch (error) {
		console.error(`Error when leaving server: ${error}`);
	}
});
