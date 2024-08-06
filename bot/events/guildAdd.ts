import { Events, EmbedBuilder, TextChannel } from 'discord.js';
import client from '../index';

client.on(Events.GuildCreate, async guild => {
	try {
		// Fetch the owner of the guild
		const owner = await guild.fetchOwner();

		// Create an embed with the guild's information
		const embedOwner = new EmbedBuilder()
			.setTitle(`Hi! Thanks for adding me to your server: **${guild.name}**.`)
			.setDescription('Hello! Please make sure that I have admin permissions enabled to function correctly.')
			.setThumbnail(guild.iconURL())
			.addFields(
				{ name: 'Guild ID', value: guild.id, inline: true }
			)
			.setColor('#00FF00')
			.setTimestamp();

		// Send a message to the owner
		await owner.send({
			embeds: [embedOwner]
		});
		console.log(`Sent a welcome message to the owner of the guild: ${guild.name}`);

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
});
