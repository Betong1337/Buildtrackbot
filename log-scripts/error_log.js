const fs = require('fs') 
const notify = require('./notify_error');

error = function(error) {
    try {
        const path = './logs';
        const base_name = '/BTB-log-';
        let data = error + "\n";

        const date = new Date();

        const year = date.getFullYear();
        const month = date.toLocaleString('default', { month: '2-digit' });
        const hour = date.getHours();
        const minutes = date.getMinutes();
        const day = date.getDate();
        const seconds = date.getSeconds();

        const error_timestamp = year + "-" + month + "-" + day + " : " + hour + ":" + minutes + ":" + seconds;
        data = error_timestamp + " | " + data;
        const time = year + "-" + month + "-" + day;
        const file_name = base_name + time + ".log";

        fs.readdir(path, (err, files) => {
            if (err) throw new Error('readdir');
            let DoLogFileAlreadyExist = false;
            files.forEach(file => {
                if (file_name === "/" + file) {
                    DoLogFileAlreadyExist = true;
                    fs.appendFile(path + file_name, data, (err) => {
                        if (err) throw new Error('appendFile');
                    });
                }
            });
            if (DoLogFileAlreadyExist === false) {
                fs.writeFile(path + file_name, data, (err) => {
                    if (err) throw err;
                });
            }
        });
        notify.admin(error, true);
    } catch (err) {
        console.log(err);
        LogError(err);
    }
}

module.exports = {error}