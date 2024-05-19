import { ActivityType, Events } from 'discord.js';
import client from '../index';

// Log into the bot
client.once(Events.ClientReady, async (bot) => {
	console.log(`Ready! Logged in as ${bot.user?.tag}`);
	bot.user.setPresence({
		activities: [
			{
				name: `Publishing from ${client.guilds.cache.size} servers.`,
				type: ActivityType.Custom,
			},
		],
		status: 'online',
	});
});

// Update the server count in the status every minute
setInterval(() => {
	if (!client?.user) return;
	client.user.setPresence({
		activities: [
			{
				name: `Publishing from ${client.guilds.cache.size} servers.`,
				type: ActivityType.Custom,
			},
		],
		status: 'online',
	});
}, 60000);