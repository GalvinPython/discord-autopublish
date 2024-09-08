import { Events, EmbedBuilder, TextChannel, ChannelType } from 'discord.js';
import client from '../index';
import { addNewGuild } from '../database';
import addPermissionsToChannel from '../utils/addPermissionsToChannel';

client.on(Events.GuildCreate, async guild => {
	try {
		// Fetch the owner of the guild
		const owner = await guild.fetchOwner();

		// Send a message to the logging channel
		const embedLoggingChannel = new EmbedBuilder()
			.setTitle("New Guild Added!")
			.setColor('Blurple')
			.setDescription(`New guild added: **${guild.name}**`)
			.setThumbnail(guild.iconURL())
			.addFields({ name: 'Guild ID', value: guild.id, inline: true })
			.addFields({ name: 'Members', value: guild.memberCount.toLocaleString(), inline: true })
			.addFields({ name: 'Owner', value: owner.user.tag, inline: true })

		const loggingChannelId = process.env.DISCORD_LOGGING_CHANNEL;
		if (!loggingChannelId) {
			throw new Error('DISCORD_LOGGING_CHANNEL environment variable is not defined.');
		}

		const channel = await client.channels.fetch(loggingChannelId) as TextChannel;
		await channel?.send({ embeds: [embedLoggingChannel] });
	} catch (error) {
		console.error(`Could not fetch the owner or send a message: ${error}`);
	}

	// Try adding the bot permissions to announcement channels
	try {
		const announcementChannels = guild.channels.cache.filter(channel => channel.type === ChannelType.GuildAnnouncement);
		announcementChannels.forEach(async channel => {
			addPermissionsToChannel(channel);
		});
		addNewGuild(guild.id);
	} catch (error) {
		console.error(`Could not add permissions to announcement channels: ${error}`);
	}
});
