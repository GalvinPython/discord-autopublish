import { Message, ChannelType } from 'discord.js';
import client from '../index';
import log from '../log';

// Run this event whenever a message has been sent
client.on('messageCreate', async (message: Message) => {
	if (message.channel.type == ChannelType.GuildAnnouncement) {
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