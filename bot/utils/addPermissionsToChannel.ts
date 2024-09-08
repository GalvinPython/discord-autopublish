import type { NewsChannel } from "discord.js";
import client from "..";
import log from "./log";

export default async function addPermissionsToChannel(targetChannel: NewsChannel): Promise<boolean> {
	try {
		if (client.user) {
			await targetChannel.permissionOverwrites.create(client.user.id, {
				ManageChannels: true,
				ManageMessages: true,
				SendMessages: true,
				ViewChannel: true,
			})
		}
		return true;
	} catch (error) {
		console.error(`Could not add permissions to channel: ${error}`);
		log(false, `Could not add permissions to channel: ${error}`);
		return false;
	}
}