import { ActivityType, Events } from 'discord.js';
import client from '../index';

// update the bot's presence
function updatePresence() {
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
}

// Log into the bot
client.once(Events.ClientReady, async (bot) => {
	console.log(`Ready! Logged in as ${bot.user?.tag}`);
	updatePresence();
});

// Update the server count in the status every minute
setInterval(updatePresence, 60000);
