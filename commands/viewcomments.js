const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder} = require('discord.js');
const db = require('../database-connection.js');
const embedStyles = require('../embedstyles.js');

module.exports = { 
	data: new SlashCommandBuilder()
        .setName('comments')
		.setDescription('View project comments!')
        .addStringOption(option =>
            option
                .setName('projectkey')
                .setDescription('projectkey')
                .setRequired(true)
        ),

	async execute(interaction) {
        try {
            var interactionOptions = interaction.options;
            const ProjectKey = interactionOptions.getString('projectkey');

            let guild = interaction.guild;
            let user = interaction.user;
            
            let guildID = guild.id;
            let username = user.username;

            let isProjectKeyValid = await db.CheckProjectKeyDuplicate(ProjectKey);
            if (!isProjectKeyValid) {
                await interaction.reply("Project Key is not valid!");
                return;
            }

            let projectComments = await db.GetProjectComments(guildID, ProjectKey);
            let comments = "";

            if (projectComments.length === 0) {
                interaction.reply("This project have currently no comments");
                return;
            }

            for (let i=0;i<projectComments.length;i++) {
                let commentData = projectComments[i];
                let commentUser = commentData.user;
                let comment = commentData.comment;
                let commentTimeStamp = commentData.comment_timestamp;
                let IsCommentDeleted = commentData.deleted;

                const date = new Date(commentTimeStamp);

                const year = date.getFullYear();
                const month = date.toLocaleString('default', { month: 'short' });
                const day = date.getDate();
                const hours = date.getHours();
                const minutes = date.getMinutes();

                const formattedDateTime = `${day} ${month} ${year} ${hours}:${minutes}`;
                if (IsCommentDeleted === 0) {
                    comments = comments + "**" + commentUser + ": **" + comment + "\n __" + formattedDateTime + "__" + "\n\n";
                }
            }
            if (comments.length === 0) {
                interaction.reply('No comments :(');
                return;
            }
            const CommentEmbed = embedStyles.commentSectionEmbed("Project " + ProjectKey + " Comments", comments);
            interaction.reply({embeds: [CommentEmbed]});

        } catch (error) {
            console.log(error);
            await interaction.reply("An error occured while executing this command.");
        }
	},
};