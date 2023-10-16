const mysql = require('mysql');
require('dotenv').config();

const db_host = process.env.DATABASE_HOST;
const db_user = process.env.DATABASE_USER;
const db_pass = process.env.DATABASE_PASS;
const db_name = process.env.DATABASE_NAME;

const DBCONFIG = {
    host : db_host,
    user : db_user,
    password : db_pass,
    database : db_name,
    multipleStatements: true
}

InsertProject = function(guild, createdBy, title, description, milestones, projectKey) {
    var conn = mysql.createConnection(DBCONFIG);
    const sql = "INSERT INTO projects (guild, createdBy, title, description, milestones, projectKey) VALUES (?,?,?,?,?,?)";

    conn.query(sql, [guild, createdBy, title, description, milestones, projectKey], function(err) {
        if (err) throw new Error('InsertProject: ' + err);
    });
    conn.commit()
    conn.end((err) => {
        if (err) throw new Error('InsertProject_conn_end: ' + err);
    });
}

CheckProjectKeyDuplicate = function(projectKey) {
    return new Promise(resolve => {
        var conn = mysql.createConnection(DBCONFIG);
        const sql = "SELECT projectkey FROM projects WHERE projectkey = ?";
        conn.query(sql, [projectKey,], function(err, rows) {
            if (err) throw new Error('CheckProjectKeyDuplicate: ' + err);

            if(rows.length == 0) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
        conn.end((err) => {
            if (err) throw new Error('CheckProjectKeyDuplicate_conn_end: ' + err);
        });
        
    });
}

CheckCommentKeyDuplicate = function(commentKey) {
    return new Promise(resolve => {
        try {
            var conn = mysql.createConnection(DBCONFIG);
            const sql = "SELECT commentKey FROM comments WHERE commentKey = ?";
            conn.query(sql, [commentKey,], function(err, rows) {
                if (rows.length === 0) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
            conn.end((err) => {
                if (err) throw new Error('CheckProjectKeyDuplicate_conn_end: ' + err);
            });
        } catch(error) {
            console.log(error);
        }
    }); 
}

GetProject = function(projectKey) {
    return new Promise(resolve => {
        var conn = mysql.createConnection(DBCONFIG);
        const sql = "SELECT * FROM projects WHERE projectkey = ?";
        conn.query(sql, [projectKey], function(err,rows) {
            if (err) throw new Error('GetProject: ' + err);
            resolve(rows);
        });
        conn.end((err) => {
            if (err) throw new Error('GetProject_conn_end: ' + err);
        });
    });
}

GetUserProjects = function(username, guildID) {
    return new Promise(resolve => {
        var conn = mysql.createConnection(DBCONFIG);
        const sql = "SELECT * FROM projects WHERE createdBy = ? AND guild = ?";
        conn.query(sql, [username, guildID], function(err,rows) {
            if (err) throw new Error('GetUserProjects: ' + err);
            resolve(rows);
        });
        conn.end((err) => {
            if (err) throw new Error('GetUserProjects: ' + err);
        });
    });
}

updateMilestone = function(projectkey, dict) {
    var conn = mysql.createConnection(DBCONFIG);
    const sql = "UPDATE projects SET milestones = ? WHERE projectkey = ?";
    conn.query(sql, [dict, projectkey], function(err) {
        if (err) throw new Error('updateMilestone: ' + err);
    });
    conn.end((err) => {
        if (err) throw new Error('GetGuildProjects_conn_end: ' + err);
    });
}

updateRecord = function(column, value, projectKey) {
    var conn = mysql.createConnection(DBCONFIG);
    const sql = `UPDATE projects SET ${column} = ? WHERE projectkey = ?`;
    conn.query(sql, [value, projectKey], function(err) {
        if (err) throw new Error('updateRecord: ' + err);
    });
    conn.end((err) => {
        if (err) throw new Error('updateRecord_conn_end: ' + err);
    });
}

delRecord = function(projectKey) {
    var conn = mysql.createConnection(DBCONFIG);
    const sql = 'DELETE FROM projects WHERE projectkey = ?';
    conn.query(sql, [projectKey,], function(err) {
        if (err) throw new Error('delRecord: ' + err);
    });
    conn.end((err) => {
        if (err) throw new Error('delRecord_conn_end: ' + err);
    });
}

CheckIfProjectIsInGuild = function(guildID, projectkey) {
    return new Promise(resolve => {
        var conn = mysql.createConnection(DBCONFIG);
        const sql = "SELECT * FROM projects WHERE projectkey = ?";
        conn.query(sql, [projectkey,], function(err, rows) {
            if (err) throw new Error('CheckIfProjectIsInGuild: ' + err);
            let data = rows[0];
            if (data.guild === guildID) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}

GetGuildProjects = function(guildID) {
    return new Promise(resolve => {
        var conn = mysql.createConnection(DBCONFIG);
        const sql = "SELECT * FROM projects WHERE guild = ?";
        conn.query(sql, [guildID,], function(err, rows) {
            if (err) throw new Error('GetGuildProjects: ' + err);
            resolve(rows);
        });
        conn.end((err) => {
            if (err) throw new Error('GetGuildProjects_conn_end: ' + err);
        });
    });
}

InsertComment = function(guildID, projectkey, username, comment, commentKey) {
    try {
        var conn = mysql.createConnection(DBCONFIG);
        const sql = "INSERT INTO comments (guildID, projectkey, comment, user, commentKey) VALUES (?,?,?,?,?)";
        conn.query(sql, [guildID, projectkey, comment, username,commentKey], function(err) {
            if (err) throw new Error('InsertComment: ' + err);
        });
        conn.end((err) => {
            if (err) throw new Error('InsertComment_conn_end: ' + err);
        });
    } catch(error) {
        console.log(error);
    }
}
GetProjectComments = function(guildID, projectkey) {
    try {
        return new Promise(resolve => {
            var conn = mysql.createConnection(DBCONFIG);
            const sql = "SELECT * FROM comments WHERE guildID = ? AND projectkey = ?";
            conn.query(sql, [guildID, projectkey], function(err, rows) {
                resolve(rows);
            });
            conn.end((err) => {
                if (err) throw new Error('GetProjectComments_conn_end: ' + err);
            });
        });
    } catch (error) {
        console.log(error);
    }
}

GetUserComments = function(username) {
    try {
        return new Promise(resolve => {
            var conn = mysql.createConnection(DBCONFIG);
            const sql = "SELECT * FROM comments WHERE user = ?";
            conn.query(sql, [username,], function(err, rows) {
                resolve(rows);
            });
            conn.end((err) => {
                if (err) throw new Error('GetUserComments_conn_end: ' + err);
            });
        });
    } catch (error) {
        console.log(error);
    }
}

GetComment = function(commentID) {
    try {
        return new Promise(resolve => {
            var conn = mysql.createConnection(DBCONFIG);
            const sql = "SELECT * FROM comments WHERE commentKey = ?";
            conn.query(sql, [commentID,], function(err, rows) {
                resolve(rows);
            });
            conn.end((err) => {
                if (err) throw new Error('GetComment_conn_end: ' + err);
            });
        });
    } catch(error) {
        console.log(error);
    }
}

editComment = function(value, commentID) {
    try {
        var conn = mysql.createConnection(DBCONFIG);
        const sql = "UPDATE comments SET comment = ? WHERE commentKey = ?";
        conn.query(sql, [value, commentID]);
        conn.end((err) => {
            if (err) throw new Error('editComment_conn_end: ' + err);
        });
    } catch(error) {
        console.log(error);
    }
}
delComment = function(commentID) {
    try {
        var conn = mysql.createConnection(DBCONFIG);
        const sql = "UPDATE comments SET deleted = ? WHERE commentKey = ?";
        conn.query(sql, ['1', commentID]);
        conn.end((err) => {
            if (err) throw new Error('delComment_conn_end: ' + err);
        });
    } catch(error) {
        console.log(error);
    }
}

module.exports = {InsertProject, CheckProjectKeyDuplicate, GetProject, updateMilestone, GetGuildProjects, 
                  updateRecord, delRecord, CheckIfProjectIsInGuild, GetUserProjects, InsertComment, GetProjectComments, 
                  GetUserComments,CheckCommentKeyDuplicate,GetComment,editComment,delComment};