import { Message, ChannelType } from 'discord.js';
import client from '../index';

// Run this event whenever a message has been sent
client.on('messageCreate', async (message: Message) => {
    if (message.channel.type == ChannelType.GuildAnnouncement) {
        try {
            await message.crosspost()
            console.log(`Published message in ${message.channelId}`);
        } catch (error) {
            console.error('Error publishing message:', error);
        }
    }
});