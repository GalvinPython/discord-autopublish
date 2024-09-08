import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";

export interface Command {
	data: {
		options: Options[];
		name: string;
		description: string;
		integration_types: number[];
		contexts: number[];
	};
	execute: (interaction: CommandInteraction) => Promise<void>;
}

export interface Options {
	type: ApplicationCommandOptionType
	name: string
	description: string
	options: Options2[]
}

export interface Options2 {
	type: ApplicationCommandOptionType
	name: string
	description: string
	required?: boolean
	choices?: Choice[]
	options?: Options3[]
}

export interface Choice {
	name: string
	value: string
}

export interface Options3 {
	type: ApplicationCommandOptionType
	name: string
	description: string
	required: boolean
}