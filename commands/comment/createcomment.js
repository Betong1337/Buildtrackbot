const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder} = require('discord.js');
const config = require('../../config.js');
const { paths } = config;

const db = require(paths.db);
const gf = require(paths.generalFuncs);
const log = require(paths.logscripts);
const embedStyles = require(paths.embedstyle);

module.exports = { 
	data: new SlashCommandBuilder()
        .setName('comment')
		.setDescription('Comment on projects')
        .addStringOption(option =>
            option
                .setName('projectkey')
                .setDescription('projectkey')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('comment')
                .setDescription("Comment text")
                .setRequired(true)
        ),

	async execute(interaction) {
        try {

            var interactionOptions = interaction.options;
            const ProjectKey = interactionOptions.getString('projectkey');
            const comment = interactionOptions.getString('comment');

            let guild = interaction.guild;
            let user = interaction.user;

            let guildID = guild.id;
            let username = user.username;
            let member = guild.members.cache.get(user.id);
            let userRoles = member._roles;

            let HasUserPermission = false;

            for (let i=0;i<userRoles.length;i++) {
                let role = guild.roles.cache.get(userRoles[i]).name;
                if (role === ProjectKey) {
                    HasUserPermission = true;
                }
            }

            if (!HasUserPermission) {
                interaction.reply("You do not have permission to comment!");
                return;
            }

            let isProjectKeyValid = await db.CheckProjectKeyDuplicate(ProjectKey);
            if (!isProjectKeyValid) {
                await interaction.reply("Project Key is not valid!");
                return;
            }

            let commentID = gf.GenerateKey(2);

            let IsCommentKeyDuplicate = db.CheckCommentKeyDuplicate(commentID);

            if (IsCommentKeyDuplicate) {
                commentID = gf.GenerateKey(2);
            }

            if (comment.length > 50) {
                interaction.reply("Comment Max length is 50 characters!");
                return;
            }

            db.InsertComment(guildID, ProjectKey, username, comment,commentID);
            interaction.reply("Your comment " + '"*' + comment + '*"' + " has been sent!");

        } catch (error) {
            log.error(error);
            console.log(error);
            await interaction.reply("An error occured while executing this command.");
        }
	},
};