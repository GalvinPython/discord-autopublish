import { ChannelType, Events } from "discord.js";
import client from "..";
import addPermissionsToChannel from "../utils/addPermissionsToChannel";

client.on(Events.ChannelCreate, async channel => {
	if (channel.type != ChannelType.GuildAnnouncement) return;
	await addPermissionsToChannel(channel);
});