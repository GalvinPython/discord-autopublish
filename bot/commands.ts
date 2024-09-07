// Commands taken from https://github.com/NiaAxern/discord-youtube-subscriber-count/blob/main/src/commands/utilities.ts

import { heapStats } from 'bun:jsc';
import client from '.';
import { ApplicationCommandOptionType, ChannelType, CommandInteractionOptionResolver, PermissionFlagsBits, type CommandInteraction } from 'discord.js';
import quickEmbed from './quickEmbed';
import type { Command } from './types/commands';
import { addChannelToGuild, checkChannelIsPaused, getChannelIdsOfGuild, hasGuildPaused, pauseGuild, removeChannelFromGuild, unpauseGuild } from './database';

const commands: Record<string, Command> = {
	ping: {
		data: {
			options: [],
			name: 'ping',
			description: 'Check the ping of the bot!',
			integration_types: [0, 1],
			contexts: [0, 1, 2],
		},
		execute: async (interaction: CommandInteraction) => {
			await interaction
				.reply({
					ephemeral: false,
					content: `Ping: ${interaction.client.ws.ping}ms`,
				})
				.catch(console.error);
		},
	},
	help: {
		data: {
			options: [],
			name: 'help',
			description: 'Get help on what each command does!',
			integration_types: [0, 1],
			contexts: [0, 1, 2],
		},
		execute: async (interaction: CommandInteraction) => {
			await client.application?.commands?.fetch().catch(console.error);
			const chat_commands = client.application?.commands.cache.map((a) => {
				return `</${a.name}:${a.id}>: ${a.description}`;
			});
			await interaction
				.reply({
					ephemeral: true,
					content: `Commands:\n${chat_commands?.join('\n')}`,
				})
				.catch(console.error);
		},
	},
	sourcecode: {
		data: {
			options: [],
			name: 'sourcecode',
			description: "Get the link of the app's source code.",
			integration_types: [0, 1],
			contexts: [0, 1, 2],
		},
		execute: async (interaction: CommandInteraction) => {
			await interaction
				.reply({
					ephemeral: true,
					content: `[Github repository](https://github.com/GalvinPython/discord-autopublish)`,
				})
				.catch(console.error);
		},
	},
	uptime: {
		data: {
			options: [],
			name: 'uptime',
			description: 'Check the uptime of the bot!',
			integration_types: [0, 1],
			contexts: [0, 1, 2],
		},
		execute: async (interaction: CommandInteraction) => {
			await interaction
				.reply({
					ephemeral: false,
					content: `Uptime: ${(performance.now() / (86400 * 1000)).toFixed(
						2,
					)} days`,
				})
				.catch(console.error);
		},
	},
	usage: {
		data: {
			options: [],
			name: 'usage',
			description: 'Check the heap size and disk usage of the bot!',
			integration_types: [0, 1],
			contexts: [0, 1, 2],
		},
		execute: async (interaction: CommandInteraction) => {
			const heap = heapStats();
			Bun.gc(false);
			await interaction
				.reply({
					ephemeral: false,
					content: [
						`Heap size: ${(heap.heapSize / 1024 / 1024).toFixed(2)} MB / ${(
							heap.heapCapacity /
							1024 /
							1024
						).toFixed(2)} MB (${(heap.extraMemorySize / 1024 / 1024).toFixed(2,)} MB) (${heap.objectCount.toLocaleString()} objects, ${heap.protectedObjectCount.toLocaleString()} protected-objects)`,
					]
						.join('\n')
						.slice(0, 2000),
				})
				.catch(console.error);
		},
	},
	cansee: {
		data: {
			options: [],
			name: 'cansee',
			description: 'Check what channels the bot can see',
			integration_types: [0],
			contexts: [0, 2],
		},
		execute: async (interaction) => {
			if (!interaction.memberPermissions?.has('ManageChannels')) {
				const errorEmbed = quickEmbed({
					color: 'Red',
					title: 'Error!',
					description: 'Missing permissions: `Manage Channels`'
				}, interaction);
				await interaction.reply({
					ephemeral: true,
					embeds: [errorEmbed]
				})
					.catch(console.error);
				return;
			}

			if (!interaction.guildId || interaction.guild == null) {
				const errorEmbed = quickEmbed({
					color: 'Red',
					title: 'Error!',
					description: 'This command can only be used in a server.'
				}, interaction);
				await interaction.reply({
					ephemeral: true,
					embeds: [errorEmbed]
				})
					.catch(console.error);
				return;
			}

			const guildId = interaction.guildId;
			const guildHasPaused = await hasGuildPaused(guildId);

			const channels = await interaction.guild.channels.fetch();
			const accessibleChannels = channels?.filter(channel => channel && client.user && channel.permissionsFor(client.user)?.has(PermissionFlagsBits.ViewChannel) && channel.permissionsFor(client.user)?.has(PermissionFlagsBits.ManageMessages) && channel.type == ChannelType.GuildAnnouncement);
			const accessibleChannelsIds = accessibleChannels?.map(channel => channel?.id);

			const channelsCanPublishFrom: string[] = [];
			const channelsBarredFromPublishing: string[] = await getChannelIdsOfGuild(guildId)

			accessibleChannelsIds?.forEach(channelId => {
				if (!channelId) return;
				if (!channelsBarredFromPublishing.includes(channelId)) {
					channelsCanPublishFrom.push(channelId);
				}
			})

			const pausedEmbed = quickEmbed({
				color: 'Red',
				title: 'Paused!',
				description: 'Publishing is currently paused for this guild.'
			}, interaction);

			const canPublishEmbed = quickEmbed({
				color: 'Green',
				title: 'Channels the bot will publish from',
				description: channelsCanPublishFrom.length > 0 ? channelsCanPublishFrom.map(id => `<#${id}>`).join('\n') : 'No channels available'
			}, interaction);

			const barredEmbed = quickEmbed({
				color: 'Orange',
				title: 'Channels the bot is barred from publishing',
				description: channelsBarredFromPublishing.length > 0 ? channelsBarredFromPublishing.map(id => `<#${id}>`).join('\n') : 'No channels barred'
			}, interaction);

			await interaction.reply({
				ephemeral: true,
				embeds: guildHasPaused ? [canPublishEmbed, barredEmbed, pausedEmbed] : [canPublishEmbed, barredEmbed],
				content: 'If there are any missing channels, please check that the bot has both the `View Channel` and `Manage Messages` permissions.'
			}).catch(console.error);
		},
	},
	pause: {
		data: {
			options: [
				{
					type: ApplicationCommandOptionType.SubcommandGroup,
					name: 'channel',
					description: 'Pause or resume publishing in a specific channel',
					options: [
						{
							type: ApplicationCommandOptionType.Subcommand,
							name: 'pause',
							description: 'Pause publishing in a specific channel',
							options: [
								{
									type: 7, // Channel type
									name: 'target_channel',
									description: 'The channel to pause publishing in',
									required: true,
								},
							],
						},
						{
							type: ApplicationCommandOptionType.Subcommand,
							name: 'resume',
							description: 'Resume publishing in a specific channel',
							options: [
								{
									type: 7, // Channel type
									name: 'target_channel',
									description: 'The channel to resume publishing in',
									required: true,
								},
							],
						},
					],
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: 'server',
					description: 'Pause or resume publishing in the entire server',
					options: [
						{
							type: ApplicationCommandOptionType.String,
							name: 'action',
							description: 'Choose to pause or resume',
							required: true,
							choices: [
								{
									name: 'Pause',
									value: 'pause',
								},
								{
									name: 'Resume',
									value: 'resume',
								},
							],
						},
					],
				},
			],
			name: 'pause',
			description: 'Pause the bot from publishing in certain channels or server',
			integration_types: [0],
			contexts: [0, 2],
		},
		execute: async (interaction: CommandInteraction) => {
			if (!interaction.memberPermissions?.has('ManageChannels')) {
				const errorEmbed = quickEmbed({
					color: 'Red',
					title: 'Error!',
					description: 'Missing permissions: `Manage Channels`'
				}, interaction);
				await interaction.reply({
					ephemeral: true,
					embeds: [errorEmbed]
				})
					.catch(console.error);
				return;
			}

			if (!interaction.guildId || interaction.guild == null) {
				const errorEmbed = quickEmbed({
					color: 'Red',
					title: 'Error!',
					description: 'This command can only be used in a server.'
				}, interaction);
				await interaction.reply({
					ephemeral: true,
					embeds: [errorEmbed]
				})
					.catch(console.error);
				return;
			}

			const subcommand = (interaction.options as CommandInteractionOptionResolver).getSubcommand()
			const subcommandGroup = (interaction.options as CommandInteractionOptionResolver).getSubcommandGroup(false);

			if (subcommandGroup === 'channel') {
				const targetChannel = (interaction.options as CommandInteractionOptionResolver).getChannel('target_channel');
				if (!targetChannel) {
					const errorEmbed = quickEmbed({
						color: 'Red',
						title: 'Error!',
						description: 'Invalid channel'
					}, interaction);
					await interaction.reply({
						ephemeral: true,
						embeds: [errorEmbed]
					})
						.catch(console.error);
					return;
				}
				if (subcommand === 'pause') {
					if (await checkChannelIsPaused(interaction.guildId, targetChannel?.id)) {
						await interaction.reply('Already paused in this channel');
						return;
					}
					await addChannelToGuild(interaction.guildId, targetChannel?.id);
					await interaction.reply(`Paused publishing in ${targetChannel?.name}`);
				} else if (subcommand === 'resume') {
					if (!await checkChannelIsPaused(interaction.guildId, targetChannel?.id)) {
						await interaction.reply('Channel is not paused');
						return;
					}
					await removeChannelFromGuild(interaction.guildId, targetChannel?.id);
					await interaction.reply(`Resumed publishing in ${targetChannel?.name}`);
				}
			} else if (subcommand === 'server') {
				const action = (interaction.options as CommandInteractionOptionResolver).getString('action');
				if (action === 'pause') {
					if (await hasGuildPaused(interaction.guildId)) {
						await interaction.reply('Already paused in the entire server');
						return;
					}
					pauseGuild(interaction.guildId);
					await interaction.reply('Paused publishing in the entire server');
				} else if (action === 'resume') {
					if (!await hasGuildPaused(interaction.guildId)) {
						await interaction.reply('Guild is not paused');
						return;
					}
					unpauseGuild(interaction.guildId);
					await interaction.reply('Resumed publishing in the entire server');
				}
			}
		},
	},
};

// Convert commands to a Map
const commandsMap = new Map<string, Command>();
for (const key in commands) {
	if (Object.prototype.hasOwnProperty.call(commands, key)) {
		const command = commands[key];
		console.log('loading ' + key);
		commandsMap.set(key, command);
	}
}

export default commandsMap;
