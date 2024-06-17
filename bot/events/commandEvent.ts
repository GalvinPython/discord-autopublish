import { Events } from 'discord.js';
import client from '../index';

import commands from '../commands';

client.on(Events.InteractionCreate, async (interaction) => {
	if (interaction.isChatInputCommand()) {
		const getCommand = commands.get(interaction.commandName);
		if (!getCommand)
			return console.log(
				`${interaction.user.displayName} tried to do /${interaction.commandName} (${interaction.commandId}) but it wasn't found.`,
			);
		return getCommand.execute(interaction);
	}
});