import { Database } from 'bun:sqlite';
import path from 'path';
import type { DatabaseStructureChannels, DatabaseStructureGuilds } from './types/database';

const db: Database = new Database(path.join(__dirname, 'db.sqlite'));

export let dbPausedChannels: Record<string, string[]> = {};
export let dbPausedGuilds: string[] = [];

export async function initDatabase(): Promise<boolean> {
	try {
		db.query(`
			CREATE TABLE IF NOT EXISTS channels (
				channel_id TEXT NOT NULL PRIMARY KEY,
				guild_id TEXT NOT NULL
			)
		`).run();

		db.query(`
			CREATE TABLE IF NOT EXISTS guilds (
				guild_id TEXT NOT NULL PRIMARY KEY,
				guild_paused BOOLEAN NOT NULL DEFAULT FALSE
			)
		`).run();
		console.log('Database initialized');
		await updatePausedList();
		setInterval(updatePausedList, 1000 * 60)
		return true;
	} catch (error) {
		console.error('Error initializing database:', error);
		return false;
	}
}

export async function getChannelIdsOfGuild(guildId: string): Promise<string[]> {
	const result = db.query('SELECT channel_id FROM channels WHERE guild_id = $guildId').all({ $guildId: guildId });
	return (result as DatabaseStructureChannels[]).map((row: DatabaseStructureChannels) => row.channel_id);
}

export async function hasGuildPaused(guildId: string): Promise<boolean> {
	const result = db.query('SELECT guild_paused FROM guilds WHERE guild_id = $guildId').get({ $guildId: guildId });
	return !(!result)
}

export async function pauseGuild(guildId: string): Promise<void> {
	db.query('UPDATE guilds SET guild_paused = TRUE WHERE guild_id = $guildId').run({ $guildId: guildId });
}

export async function unpauseGuild(guildId: string): Promise<void> {
	db.query('UPDATE guilds SET guild_paused = FALSE WHERE guild_id = $guildId').run({ $guildId: guildId });
}

export async function addChannelToGuild(guildId: string, channelId: string): Promise<void> {
	db.query('INSERT INTO channels (channel_id, guild_id) VALUES ($channelId, $guildId)').run({ $channelId: channelId, $guildId: guildId });
}

export async function removeChannelFromGuild(guildId: string, channelId: string): Promise<void> {
	db.query('DELETE FROM channels WHERE guild_id = $guildId AND channel_id = $channelId').run({ $guildId: guildId, $channelId: channelId });
}

export async function checkChannelIsPaused(guildId: string, channelId: string): Promise<boolean> {
	const result = db.query('SELECT guild_paused FROM guilds WHERE guild_id = $guildId').get({ $guildId: guildId, $channelId: channelId });
	return !(!result)
}

//#region Guild Management
export async function addNewGuild(guildId: string): Promise<void> {
	db.query('INSERT INTO guilds (guild_id) VALUES ($guildId)').run({ $guildId: guildId });
}
export async function removeGuild(guildId: string): Promise<void> {
	db.query('DELETE FROM guilds WHERE guild_id = $guildId').run({ $guildId: guildId });
	db.query('DELETE FROM channels WHERE guild_id = $guildId').run({ $guildId: guildId });
}
//#endregion

//#region Update
// Update dbPausedChannels and dbPausedGuilds every minute
export async function updatePausedList() {
	dbPausedChannels = {};
	dbPausedGuilds = [];

	const resultGuilds = db.query('SELECT * FROM guilds').all();
	(resultGuilds as DatabaseStructureGuilds[]).forEach((row: DatabaseStructureGuilds) => {
		if (row.guild_paused) {
			dbPausedGuilds.push(row.guild_id);
		}
	});

	const resultChannels = db.query('SELECT * FROM channels').all();
	(resultChannels as DatabaseStructureChannels[]).forEach((row: DatabaseStructureChannels) => {
		if (!dbPausedChannels[row.guild_id]) dbPausedChannels[row.guild_id] = [];
		dbPausedChannels[row.guild_id].push(row.channel_id);
	});
}
//#endregion