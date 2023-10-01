const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const gf = require('../general-functions.js');
const db = require('../database-connection.js');
const embedStyles = require('../embedstyles.js');

module.exports = { 
	data: new SlashCommandBuilder()
        .setName('vwmyprojects')
		.setDescription('View my Projects')
        .addIntegerOption(option => 
            option
                .setName('page')
                .setDescription("Select Page")
                .setRequired(false)
        ),
        
	async execute(interaction) {

        function chunkArray(array, chunkSize) {
            const result = [];
            for (let i = 0; i < array.length; i += chunkSize) {
              result.push(array.slice(i, i + chunkSize));
            }
            return result;
          }
        try {
            var guildID = interaction.guild.id;
            var embedList = [];
            const username = interaction.user.username;

            let pageNumber = interaction.options.getInteger("page") - 1;
            if (pageNumber === -1) {
                pageNumber = 0;
            } else if (pageNumber < 0) {
                await interaction.reply("Page number can't be below 1!");
                return;
            }
            const userProjectData = await db.GetUserProjects(username, guildID)

            for(let i=0;i<userProjectData.length;i++) {
                var title = gf.limitStringLength(userProjectData[i].title, 20);
                var projectkey = userProjectData[i].projectkey;
                var timestamp = JSON.stringify(userProjectData[i].time_created);
                var dateCreated = timestamp.split('T')[0];
                dateCreated = dateCreated.replace('"', "");
                var createdBy = gf.limitStringLength(userProjectData[i].createdBy, 18);

                embedList.push({name: title, value: createdBy, inline: true},
                            {name: "Project Key", value: projectkey, inline: true},
                            {name: "Date Created", value: dateCreated, inline: true});
            }
            const pages = chunkArray(embedList, 15);
            const pagelength = pages.length;

            if (pageNumber+1 > pagelength) {
                await interaction.reply("That many pages dosen't exist!");
                return;
            }

            const projectEmbed = embedStyles.viewMyEmbed(username + "'s Projects", pages[pageNumber], pageNumber+1);

            await interaction.reply({embeds: [projectEmbed]});

        } catch(error) {
            console.log(error);
            await interaction.reply("An error occured while executing this command.");
        }
	},

};