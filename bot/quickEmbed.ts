import { EmbedBuilder, type Client, type ColorResolvable, type CommandInteraction } from "discord.js";

export default function (
	{ color, title, description }: { color: ColorResolvable; title: string; description: string },
	interaction?: CommandInteraction,
	client?: Client
) {
	return new EmbedBuilder()
		.setColor(color)
		.setTitle(title)
		.setDescription(description)
		.setTimestamp()
		.setFooter({
			text:
				interaction?.client.user.displayName ??
				client?.user?.displayName ??
				'No name',
			iconURL:
				interaction?.client?.user?.avatarURL() ??
				client?.user?.avatarURL() ??
				'https://cdn.discordapp.com/embed/avatars/0.png',
		});
}