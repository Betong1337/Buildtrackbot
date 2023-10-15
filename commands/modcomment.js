const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder} = require('discord.js');
const db = require('../database-connection.js');
const embedStyles = require('../embedstyles.js');
const log = require('../error_log.js');
module.exports = { 
	data: new SlashCommandBuilder()
        .setName('editcomment')
		.setDescription('Edit your comment!')
        .addStringOption(option => 
            option
                .setName('commentid')
                .setDescription('Comment Key')
                .setRequired(true)
        ),

	async execute(interaction) {
        try {
            const CommentKey = interaction.options.getString('commentid');
            let IsCommentKeyValid = await db.CheckCommentKeyDuplicate(CommentKey);

            if (!IsCommentKeyValid) {
                interaction.reply("Comment Key is not valid!");
                return;
            }

            const commentData = await db.GetComment(CommentKey);

            const commentmsg = commentData[0].comment;

            const IsCommentDeleted = commentData[0].deleted;

            if (IsCommentDeleted === 1) {
                interaction.reply("Comment Key is not valid!");
                return;
            }

            const modal = new ModalBuilder()
			.setCustomId('MCCommentEdit')
			.setTitle('Edit Comment');

		    const CommentMSG = new TextInputBuilder()
            .setCustomId('MCCommentMsg')
            .setLabel("Edit Comment")
            .setValue(commentmsg)
            .setMaxLength(50)
            .setMinLength(1)
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
            
            const firstActionRow = new ActionRowBuilder().addComponents(CommentMSG);

            modal.addComponents(firstActionRow);

            await interaction.showModal(modal);

            const submitted = await interaction.awaitModalSubmit({
                time: 600000,

                filter: i => i.user.id === interaction.user.id,
            }).catch(error => {
                console.error(error)
            return null
            })
      
            if (!submitted) return;
            await submitted.deferReply();
            
            let modifiedComment = submitted.fields.getTextInputValue('MCCommentMsg');

            if (modifiedComment === commentmsg) {
                await submitted.editReply('Comment has been edited!');
                return;
            }

            db.editComment(modifiedComment, CommentKey);
            await submitted.editReply('Comment has been edited!');

        } catch (error) {
            log.error(error);
            console.log(error);
            await interaction.reply("An error occured while executing this command.");
        }
	},
};