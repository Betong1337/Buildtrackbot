const fs = require('fs') 
      
LogError = function(error) {
    try {
        const path = './logs/';
        const base_name = 'BTB-log-';
        const data = error;

        const date = new Date();

        const year = date.getFullYear();
        const month = date.toLocaleString('default', { month: '2-digit' });
        
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();

        const time = year + "-" + month + "-" + day + " : " + hours + ":" +  "0" + minutes;
        const file_name = base_name + time;
        fs.writeFile(path + file_name, data, (err) => {
            if (err) throw err;
        });
    } catch (err) {
        console.log(err);
        LogError(err);
    }
}

LogError("This is a error");