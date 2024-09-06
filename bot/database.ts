import { Database } from 'bun:sqlite';
import path from 'path';

const db: Database = new Database(path.join(__dirname, 'db.sqlite'));

interface DatabaseStructure {
	channel_id: string;
	guild_id: string;
	guild_paused: boolean;
}

export async function initDatabase(): Promise<boolean> {
	try {
		db.query(`
			CREATE TABLE IF NOT EXISTS guilds (
				channel_id TEXT NOT NULL PRIMARY KEY,
				guild_id TEXT NOT NULL,
				guild_paused BOOLEAN DEFAULT FALSE
			);
		`).run();
		console.log('Database initialized');
		return true;
	} catch (error) {
		console.error('Error initializing database:', error);
		return false;
	}
}

export async function getChannelIdsOfGuild(guildId: string): Promise<string[]> {
	const result = db.query('SELECT channel_id FROM guilds WHERE guild_id = $guildId').all({ $guildId: guildId });
	console.dir(result, { depth: null });
	return (result as DatabaseStructure[]).map((row: DatabaseStructure) => row.channel_id);
}

export async function hasGuildPaused(guildId: string): Promise<boolean> {
	const result = db.query('SELECT guild_paused FROM guilds WHERE guild_id = $guildId').get({ $guildId: guildId });
	return !(!result)
}

export async function pauseGuild(guildId: string): Promise<void> {
	db.query('INSERT INTO guilds (channel_id, guild_id, guild_paused) VALUES (0, $guildId, $guildPaused)').run({ $guildId: guildId, $guildPaused: true });
}

export async function unpauseGuild(guildId: string): Promise<void> {
	db.query('DELETE FROM guilds WHERE guild_id = $guildId AND guildPaused = TRUE AND channel_id = 0').run({ $guildId: guildId });
}

export async function addChannelToGuild(guildId: string, channelId: string): Promise<void> {
	db.query('INSERT INTO guilds (channel_id, guild_id, guild_paused) VALUES ($channelId, $guildId, FALSE)').run({ $channelId: channelId, $guildId: guildId });
}

export async function removeChannelFromGuild(guildId: string, channelId: string): Promise<void> {
	db.query('DELETE FROM guilds WHERE guild_id = $guildId AND channel_id = $channelId').run({ $guildId: guildId, $channelId: channelId });
}

export async function checkChannelIsPaused(guildId: string, channelId: string): Promise<boolean> {
	const result = db.query('SELECT guild_paused FROM guilds WHERE guild_id = $guildId AND channel_id = $channelId').get({ $guildId: guildId, $channelId: channelId });
	return !(!result)
}
