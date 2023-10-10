const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder} = require('discord.js');
const db = require('../database-connection.js');
const embedStyles = require('../embedstyles.js');

module.exports = { 
	data: new SlashCommandBuilder()
        .setName('delcomment')
		.setDescription('Delete your comment!')
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

            const modal = new ModalBuilder()
			.setCustomId('MCCommentDelete')
			.setTitle('Delete Comment');

		    const CommentMSG = new TextInputBuilder()
            .setCustomId('MCCommentConfirmDelete')
            .setLabel("Type 'DELETE' to confirm")
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
            
            let DeleteConfirm = submitted.fields.getTextInputValue('MCCommentConfirmDelete');

            if (DeleteConfirm != "DELETE") {
                await submitted.editReply('Wrong, try again!');
                return;
            }

            //db.editComment("*DELETED*", CommentKey);
            db.delComment(CommentKey);
            await submitted.editReply('Comment has been Deleted!');

        } catch (error) {
            console.log(error);
            await interaction.reply("An error occured while executing this command.");
        }
	},
};