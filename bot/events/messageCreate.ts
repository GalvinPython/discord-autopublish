import { Message, ChannelType } from 'discord.js';
import client from '../index';
import log from '../utils/log';
import { dbPausedChannels, dbPausedGuilds } from '../database';

// Run this event whenever a message has been sent
client.on('messageCreate', async (message: Message) => {
	if (message.channel.type == ChannelType.GuildAnnouncement) {
		const guildId = message.guildId
		const channelId = message.channelId

		if (!guildId || !channelId) return;

		if (dbPausedGuilds.includes(guildId) || dbPausedChannels[guildId]?.includes(channelId)) {
			log(false, `Message in paused channel:
				${channelId} [${message.channel.name}]
				(${guildId}, ${message.guild?.name})`
			)
			return
		}

		try {
			await message.crosspost()
			log(true, `Published message in:
				${message.channelId} [${message.channel.name}]
				(${message.guildId}, ${message.guild?.name})
			`)
		} catch (error) {
			console.error(error)
			log(false, `Error sending message in:
				${message.channelId} [${message.channel.name}]
				(${message.guildId}, ${message.guild?.name})
				${error}
			`);
		}
	}
});