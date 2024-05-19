// Check if DISCORD_TOKEN has been provided as an environment variable
const discordToken: string | undefined = process.env?.DISCORD_TOKEN
if (!discordToken) throw 'You MUST provide a discord token in .env!'

// If it has, run the bot
import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import commandsMap from './commands';
import fs from 'fs/promises';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Update the commands
console.log(`Refreshing ${commandsMap.size} commands`)
const rest = new REST().setToken(discordToken)
const getAppId: any = await rest.get(Routes.currentApplication()) || { id: null }
if (!getAppId?.id) throw 'No application ID was able to be found with this token'
const data: any = await rest.put(
    Routes.applicationCommands(getAppId.id),
    {
        body: [...commandsMap.values()].map((a) => {
            return a.data;
        }),
    },
);

console.log(
    `Successfully reloaded ${data.length} application (/) commands.`,
);

client.login(discordToken);

export default client

// Import events
const getEvents = await fs.readdir('src/events');
for await (const file of getEvents) {
	await import('./events/' + file);
}
