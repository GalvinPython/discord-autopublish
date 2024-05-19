# Discord Auto Publisher Bot
📢 The simplest Discord Bot ever that automatically publishes announcements for you. No setup required; it just runs

[Invite it here](https://discord.com/oauth2/authorize?client_id=1241739031252045935&permissions=8&scope=bot+applications.commands)

# Why use this?
* Automatically publishes announcements for you, in case you forget; or a bot sends a message; or you just want to take the easier route
* No setup required. It'll automatically publish messages if they're sent in announcement channels
* No message delay either. It just listens for messages rather than searching for the latest message in annoucement channel

# Instructions
1) [Invite the bot to a server of your choice, with all the permissions](https://discord.com/oauth2/authorize?client_id=1241739031252045935&permissions=8&scope=bot+applications.commands)
2) That's it! Once the bot has been invited, it'll listen out for any messages and will publish them automatically
Note: It is recommended to send a test message to ensure that the bot is working. If it isn't, check the section below

# Why admin?
I don't create my bots with admin permissions unless absolutely necessary, however this is a early product and during testing we ran into a lot of permission related issues. The solution was to give it admin permissions.  
This can be slightly concerning, sure, however security is always my number one priority.

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
