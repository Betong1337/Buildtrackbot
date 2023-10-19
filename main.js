const fs = require('node:fs');
const path = require('node:path');
const gf = require('./utilities/general-functions.js');
const { Client, Collection, Events, GatewayIntentBits, ActivityType } = require('discord.js');
require('dotenv').config();

const token = process.env.DISCORD_BOT_TOKEN;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions], });

client.commands = new Collection();

const commands = [];
// Grab all the command files from the commands directory you created earlier
let commandFiles = [];
const commandPaths = ['./commands/project', './commands/comment', './commands/general'];

for (let i=0;i<commandPaths.length;i++) {
	commandFiles.push(fs.readdirSync(commandPaths[i]).filter(file => file.endsWith('.js')));
}
for (let j=0;j<commandFiles[0].length;j++) {
	commandFiles[0][j] = commandPaths[0] + "/" + commandFiles[0][j]
}
for (let k=0;k<commandFiles[1].length;k++) {
	commandFiles[1][k] = commandPaths[1] + "/" + commandFiles[1][k]
}
for (let l=0;l<commandFiles[2].length;l++) {
	commandFiles[2][l] = commandPaths[2] + "/" + commandFiles[2][l]
}
commandFiles = gf.flattenArray(commandFiles);

for (const file of commandFiles) {
	//const filePath = path.join(commandsPath, file);
	const command = require(file);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}
// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
	client.user.setActivity('/help');
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		//await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});



// Log in to Discord with your client's token
client.login(token);