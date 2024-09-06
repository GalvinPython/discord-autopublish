import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";

export interface Command {
	data: {
		options: Option[];
		name: string;
		description: string;
		integration_types: number[];
		contexts: number[];
	};
	execute: (interaction: CommandInteraction) => Promise<void>;
}

export interface Option {
	type: ApplicationCommandOptionType
	name: string
	description: string
	options: Option2[]
}

export interface Option2 {
	type: ApplicationCommandOptionType
	name: string
	description: string
	required?: boolean
	choices?: Choice[]
	options?: Option3[]
}

export interface Choice {
	name: string
	value: string
}

export interface Option3 {
	type: ApplicationCommandOptionType
	name: string
	description: string
	required: boolean
}