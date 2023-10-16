const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder} = require('discord.js');
const config = require('../../config.js');
const { paths } = config;
console.log(paths);
const db = require(paths.db);
const gf = require(paths.generalFuncs);
const log = require(paths.logscripts);
const embedStyles = require(paths.embedstyle);

module.exports = { 
	data: new SlashCommandBuilder()
        .setName('crproject')
		.setDescription('Project'),

	async execute(interaction) {
        const modal = new ModalBuilder()
			.setCustomId('MCProjectCreate')
			.setTitle('Create Project');

		const ProjectNameInput = new TextInputBuilder()
            .setCustomId('MCProjectNameInput')
            .setLabel("Name of Project")
            .setPlaceholder("BTB's House")
            .setMinLength(3)
            .setMaxLength(30)
            .setRequired(true)
            .setStyle(TextInputStyle.Short);

        const ProjectDescriptionInput = new TextInputBuilder()
            .setCustomId('MCProjectDescriptionInput')
            .setLabel("Project Description")
            .setPlaceholder("Example:\nBuilding a House in BTB-City.\nCords: x:1234, z:1234")
            .setMinLength(15)
            .setMaxLength(150)
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph);

        const ProjectMilestonesInput = new TextInputBuilder()
            .setCustomId('MCProjectMilestonesInput')
            .setLabel("Project Milestones")
            .setPlaceholder("USAGE: Foundation,Walls,Roof")
            .setMinLength(5)
            .setMaxLength(500)
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph);
            
    const firstActionRow = new ActionRowBuilder().addComponents(ProjectNameInput);
    const secondActionRow = new ActionRowBuilder().addComponents(ProjectDescriptionInput);
    const thirdActionRow = new ActionRowBuilder().addComponents(ProjectMilestonesInput);

    modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

    await interaction.showModal(modal);

    const submitted = await interaction.awaitModalSubmit({
            time: 600000,

            filter: i => i.user.id === interaction.user.id,
        }).catch(error => {
            console.error(error)
            return null
        })

        try {
            if (!submitted) return;
            await submitted.deferReply();

            let ProjectName = submitted.fields.getTextInputValue('MCProjectNameInput');
            let ProjectDescription = submitted.fields.getTextInputValue('MCProjectDescriptionInput');
            let ProjectMilestones = submitted.fields.getTextInputValue('MCProjectMilestonesInput');

            let MilestoneList = ProjectMilestones.split(',');

            let MilestoneDict = {};

            for (let i=0;i<MilestoneList.length;i++) {
                let Milestone = i+1 + "." + " " + MilestoneList[i];
                MilestoneDict[Milestone] = false;
                MilestoneList[i] = Milestone;
            }

            let guildID = interaction.guild.id;
            let username = interaction.user.username;
            const user = interaction.user;

            const milestoneString = JSON.stringify(MilestoneDict);

            var ProjectKey = gf.GenerateKey(1);

            let IsKeyUnique = await db.CheckProjectKeyDuplicate(ProjectKey);
            if (IsKeyUnique) {
                ProjectKey = gf.GenerateKey(1);
            }

            var guildObject = interaction.guild;
            let role = await guildObject.roles.create({name: ProjectKey});
            let member = guildObject.members.cache.get(user.id);
            await member.roles.add(role);

            await db.InsertProject(guildID, username, ProjectName, ProjectDescription, milestoneString, ProjectKey);
    
            let list = await gf.DictToEmbedList(MilestoneDict, MilestoneList);
            var embedList = list[0];

            var percentageDone = 0;
            const projectEmbed = embedStyles.ProjectEmbed(ProjectName, ProjectDescription, ProjectKey, embedList, percentageDone);

            await submitted.editReply({embeds: [projectEmbed]});
            await submitted.followUp({content: "Don't forget to add the project role to other builders!"});
        } catch(error) {
            log.errror(error);
            console.log(error);
            await interaction.reply("An error occured while executing this command.");  
        }
      

	},

};