const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const config = require('../../config.js');
const { paths } = config;
const db = require(paths.db);
const gf = require(paths.generalFuncs);
const log = require(paths.logscripts);
const embedStyles = require(paths.embedstyle);

module.exports = { 
	data: new SlashCommandBuilder()
        .setName('help')
		.setDescription('List of All Commands'),

	async execute(interaction) {
        try {
            var commandList = ["**/crproject** - *Create a new Project.*", "**/modproject** - *Modify existing project*", "**/delproject** - *Delete project*","**/upproject** - *Update Milestone within a Project.*",
            "**/vwproject** - *View a Project*", "**/vwgprojects** - *View all projects within the guild*"];
            var commands = [];
            commandList.forEach(command => {
                var desc = command.split('-')[1];
                var command = command.split('-')[0];
                commands.push({name: command, value: desc, inline: false});
            });
            const helpembed = embedStyles.helpEmbed(commands);
            await interaction.reply({embeds: [helpembed]});
        } catch(error) {
            console.log(error);
            log.error(error);
            await interaction.reply("An Error occured while executing this command.");
        }
	},

};