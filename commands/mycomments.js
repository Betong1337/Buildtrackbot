const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder} = require('discord.js');
const db = require('../database-connection.js');
const embedStyles = require('../embedstyles.js');

module.exports = { 
	data: new SlashCommandBuilder()
        .setName('mycomments')
		.setDescription('View all your comments!'),

	async execute(interaction) {
        try {
            var interactionOptions = interaction.options;

            let guild = interaction.guild;
            let user = interaction.user;
            
            let guildID = guild.id;
            let username = user.username;

            let userComments = await db.GetUserComments(username);
            let comments = "";

            if (userComments.length === 0) {
                interaction.reply("This project have currently no comments");
                return;
            }

            let commentCount = 1;
            for (let i=0;i<userComments.length;i++) {
                let commentData = userComments[i];
                let comment = commentData.comment;
                let commentTimeStamp = commentData.comment_timestamp;
                let projectKey = commentData.projectkey;
                let commentKey = commentData.commentKey;
                let IscommentDeleted = commentData.deleted;

                const date = new Date(commentTimeStamp);

                const year = date.getFullYear();
                const month = date.toLocaleString('default', { month: 'short' });
                const day = date.getDate();
                const hours = date.getHours();
                const minutes = date.getMinutes();

                const formattedDateTime = `${day} ${month} ${year} ${hours}:${minutes}`;
                if (IscommentDeleted === 0) {
                    comments = comments + "**" + commentCount + ". " + commentKey + "** " + '*"' + 
                           comment + '"*' + " __" + formattedDateTime + "__" + " **" + projectKey + "**" + "\n\n";
                    commentCount++;
                }
            }
            const CommentEmbed = embedStyles.commentSectionEmbed(username + "'s Comments", comments);
            interaction.reply({embeds: [CommentEmbed]});

        } catch (error) {
            console.log(error);
            await interaction.reply("An error occured while executing this command.");
        }
	},
};