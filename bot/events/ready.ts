import { ActivityType, Events, PresenceUpdateStatus } from 'discord.js';
import client from '../index';
import { dbMetrics } from '../database';

// update the bot's presence
function updatePresence() {
	if (!client?.user) return;
	const servers = client.guilds.cache.size
	const members = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)

	dbMetrics.total_servers = servers;
	dbMetrics.total_members = members;

	client.user.setPresence({
		activities: [
			{
				name: `Publishing from ${servers} servers [${members} members]`,
				type: ActivityType.Custom,
			},
		],
		status: PresenceUpdateStatus.Online,
	});
}

// Log into the bot
client.once(Events.ClientReady, async (bot) => {
	console.log(`Ready! Logged in as ${bot.user?.tag}`);
	updatePresence();
});

// Update the server count in the status every minute
setInterval(updatePresence, 60000);