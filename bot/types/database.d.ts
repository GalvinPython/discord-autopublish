export interface DatabaseStructureChannels {
	channel_id: string;
	guild_id: string;
}

export interface DatabaseStructureGuilds {
	guild_id: string;
	guild_paused: boolean;
}

export interface DatabaseStructureMetrics {
	total_messages: number;
	total_servers: number;
	total_members: number;
}