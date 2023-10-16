const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
require('dotenv').config();

const gf = require('./utilities/general-functions.js');

const token = process.env.DISCORD_BOT_TOKEN;
const clientId = process.env.DISCORD_BOT_CLIENTID;

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
	const command = require(file);
	commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();