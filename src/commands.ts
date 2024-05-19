// Commands taken from https://github.com/NiaAxern/discord-youtube-subscriber-count/blob/main/src/commands/utilities.ts

import { heapStats } from 'bun:jsc';
import client from './index';
import type { CommandInteraction } from 'discord.js';

interface Command {
    data: {
        options: any[];
        name: string;
        description: string;
        integration_types: number[];
        contexts: number[];
    };
    execute: (interaction: CommandInteraction) => Promise<void>;
}

const commands: { [key: string]: Command } = {
    ping: {
        data: {
            options: [],
            name: 'ping',
            description: 'Check the ping of the bot!',
            integration_types: [0, 1],
            contexts: [0, 1, 2],
        },
        execute: async (interaction: { reply: (arg0: { ephemeral: boolean; content: string; }) => Promise<any>; client: { ws: { ping: any; }; }; }) => {
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
        execute: async (interaction: { reply: (arg0: { ephemeral: boolean; content: string; }) => Promise<any>; }) => {
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
        execute: async (interaction: { reply: (arg0: { ephemeral: boolean; content: string; }) => Promise<any>; }) => {
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
        execute: async (interaction: { reply: (arg0: { ephemeral: boolean; content: string; }) => Promise<any>; }) => {
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
        execute: async (interaction: { reply: (arg0: { ephemeral: boolean; content: string; }) => Promise<any>; }) => {
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
};

// Convert commands to a Map
const commandsMap = new Map<string, Command>();
for (const key in commands) {
    if (commands.hasOwnProperty(key)) {
        const command = commands[key];
        console.log('loading ' + key);
        commandsMap.set(key, command);
    }
}

export default commandsMap;
