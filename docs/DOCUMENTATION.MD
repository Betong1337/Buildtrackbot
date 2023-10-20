What is the bot doing?
Tracks your build projects in minecraft for example. You can add milestones, then check milestones to see how much you have left.

Commands
 /crproject - Create a new project.
 /modproject -  Modify a already existing project, add milestones, remove milestones, modify milestones, description, title
 /vwproject [projectkey] - View a project.
 /vwgprojects - View all projects created within the guild.
 /upproject [projectkey] [milestonesnumber] [milestonestate] - Update a milestone when the milestone is reached.

 Database Layout:
    Tables: 
        projects:
            id
            guild
            createdBy
            title
            description
            milestones
            projectKey

Milestones dict layout
    {Foundation: true,Walls: false,Roof: true,Windows: false}

Project Key layout
    BTB-ud72diw#1s

    "BTB-": Base Key
    "ud72diw#1s": Unique Key

Permission:
    Roles created when project is created.
    Only people with the Project role will be able to update the project.


Comment system:
    Database Structure
        Comment ID
        Project Key
        Username
        Comment text
        Timestamp
    Commands:
        /comment [projectkey] [comment]
        /comments [projectkey]
        /mycomments [projectkey]
        /editcomment [projectkey] [commentID]
        
    Example format:
        Comment 1 2023-09-09 21:02:
        user1234: Cleared 50%.

        Comment 2 - 2023-09-09 21:01:
        user312: Cleared 100%.

    /vwmycomments:
       [ProjectKey] [Comment]        [Timestamp]        [CommentID]
       BTB-123dsasf "Cleared 100%."  2023-09-09 21:32   COM-ksie23s

Error log system:
    Writes error to log in /logs and notifies via email.