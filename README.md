# Discord Auto Publisher Bot

📢 The simplest Discord Bot ever that automatically publishes announcements for you. No setup required; it just runs

[Invite it here](https://discord.com/oauth2/authorize?client_id=1241739031252045935&permissions=268446736&integration_type=0&scope=bot+applications.commands)

# Why use this?

- Automatically publishes announcements for you, in case you forget; or a bot sends a message; or you just want to take the easier route
- No setup required. It'll automatically publish messages if they're sent in announcement channels
- No message delay either. It just listens for messages rather than searching for the latest message in annoucement channel

# Instructions

1. [Invite the bot to a server of your choice, with all the permissions](https://discord.com/oauth2/authorize?client_id=1241739031252045935&permissions=268446736&integration_type=0&scope=bot+applications.commands)
2. That's it! Once the bot has been invited, it'll listen out for any messages and will publish them automatically

# Required Permissions

- Manage Channels
- Manage Messages
- Manage Roles
- Send Messages
- View Channels

# Rate Limits

Discord has a rate limit for publishing channels of 10 announcements per server **per hour**.  
Please do not use this in your server if you exceed this limit

# New in 1.1.0

The bot has been restructured - mainly because of the admin permissions and how volatile it could be. Whilst it worked, I wanted to ditch it and make it more secure. You now have more control over what gets published and when it joins a server, will automatically add all needed permissions to it.
_Not all features that were meant to be in 1.1.0 were added in it. That's for 1.1.1 as I had to ship it early_

# Website

The website for the bot is [here](https://autopublish.galvindev.me.uk)!

<!-- # Support
[Support Discord Server](https://discord.gg/<REDACTED_FOR_NOW>) -->

# User Integration

User Integration is only there so you can use the commands, which are for utility/informational purposes only. You **cannot** use the User Integration to publish messages from other servers, because there is no command to do that

# Dev Instructions

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run start
```

or

```bash
bun .
```

This project was created using `bun init` in bun v1.1.7. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
