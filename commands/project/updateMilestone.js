const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config.js');
const { paths } = config;
const db = require(paths.db);
const gf = require(paths.generalFuncs);
const log = require(paths.logscripts);
const embedStyles = require(paths.embedstyle);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('upproject')
    .setDescription('update milestone')
    .addStringOption(option =>
      option
        .setName('projectkey')
        .setDescription('projectkey')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName('milestonenumber')
        .setDescription('milestone')
        .setRequired(true)
    )
    .addBooleanOption(option =>
      option
        .setName('milestonestate')
        .setDescription('Set milestone to true or false')
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
        const interactionOptions = interaction.options;
        const ProjectKey = interactionOptions.getString('projectkey');
        const MilestoneNumberInput = interactionOptions.getInteger('milestonenumber');
        const Milestonestate = interactionOptions.getBoolean('milestonestate');
        const roleCache = interaction.guild.roles.cache;
        const guildID = interaction.guild.id;

        const userRoleList_ID = interaction.member._roles;
        let ProjectRoleID;

        let HasUserPermission = false;

        roleCache.forEach(role => {
            const roleID = role.id;
            const roleName = role.name;
            if (ProjectKey == roleName) {
                ProjectRoleID = roleID;
            }
        });

        userRoleList_ID.forEach(userRoleID => {
            if (userRoleID == ProjectRoleID) {
                HasUserPermission = true;
            }
        });
        await interaction.deferReply();

        if (!HasUserPermission) {
            await interaction.editReply("You do not have permission!");
            return;
        }

        // Check if projectkey is valid
        const isProjectKeyValid = await db.CheckProjectKeyDuplicate(ProjectKey);
        if (!isProjectKeyValid) {
            await interaction.editReply({ content: "Projectkey is not valid!" });
            return;
        }

        const IsProjectInGuild = await db.CheckIfProjectIsInGuild(guildID, ProjectKey);

        if (!IsProjectInGuild) {
            await interaction.editReply("The project is not in this server!");
            return;
        }

        // Check if MilestoneNumber is valid
        const ProjectData = await db.GetProject(ProjectKey);
        const data = ProjectData[0];
        const MilestoneDict = JSON.parse(data.milestones);

        let IsNumberValid = false;
        let selectedMilestone;
        const MilestoneList = [];

        const ProjectName = data.title;
        const ProjectDescription = data.description;

        Object.keys(MilestoneDict).forEach(milestone => {
            const milestoneNum = parseInt(milestone[0]);
            MilestoneList.push(milestone);
            if (MilestoneNumberInput == milestoneNum) {
                IsNumberValid = true;
                selectedMilestone = milestone;
            }
        });

        if (!IsNumberValid) {
            await interaction.editReply({ content: "Milestone Number is not valid!" });
            return;
        }

        if (MilestoneDict[selectedMilestone] == Milestonestate) {
            await interaction.editReply({ content: "Milestone is already at " + Milestonestate + " state!" });
            return;
        }

        MilestoneDict[selectedMilestone] = Milestonestate;
        await db.updateMilestone(ProjectKey, JSON.stringify(MilestoneDict));

        const list = await gf.DictToEmbedList(MilestoneDict, MilestoneList);
        const embedList = list[0];
        const countList = list[1];

        const sum = countList[0] + countList[1];
        const andel = countList[0];
        const percentageDone = gf.PercentageOf(sum, andel);

        const projectEmbed = embedStyles.ProjectEmbed(ProjectName, ProjectDescription, ProjectKey, embedList, percentageDone);

        await interaction.editReply({ embeds: [projectEmbed] });
    } catch (error) {
      log.error(error);
      console.error(error);
      await interaction.editReply("An error occured while executing this command.");
    }
  },
};
