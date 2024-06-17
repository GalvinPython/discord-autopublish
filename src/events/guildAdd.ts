import { Events, EmbedBuilder } from 'discord.js';
import client from '../index';

client.on(Events.GuildCreate, async guild => {
	// Fetch the owner of the guild
	try {
		const owner = await guild.fetchOwner();

		// Create an embed with the guild's information
		const embed = new EmbedBuilder()
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
			embeds: [embed]
		});

		console.log(`Sent a welcome message to the owner of the guild: ${guild.name}`);
	} catch (error) {
		console.error(`Could not fetch the owner or send a message: ${error}`);
	}
});
