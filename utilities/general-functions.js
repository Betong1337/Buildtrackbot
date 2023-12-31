
DictToEmbedList = function(dict, milestonelist) {
    return new Promise(resolve => {
        //index 0 = white_check_mark, index 1 = x
        var returnlist = [];
        var percentageList = [];
        var white_check_markCount = 0;
        var x_count = 0;
        for (let i=0;i<milestonelist.length;i++) {
            Milestone = milestonelist[i]
            let MilestoneValue = dict[Milestone]
            let emote = ':x:';
            if (MilestoneValue == true) {
                emote = ':white_check_mark:';
                white_check_markCount++;
            } else {
                x_count++;
            }
            Milestone = Milestone + " " + emote;
            returnlist.push({name: Milestone, value: '\u0009', inline: false});
        }
        percentageList.push(white_check_markCount, x_count);
        resolve([returnlist, percentageList]);
    });
}

PercentageOf = function(sum, part) {
    return Math.round((part / sum) * 100);
}

GenerateKey = function(option) {
    char_list = ['a', 'b', 'c','d', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
                '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '!', '#', '$', '&'];
                
    let baseKey = 'BTB-';
    if (option === 1) {
        baseKey = "BTB-";
    } else if (option === 2) {
        baseKey = "COM-";
    }

    let uniqueKey = '';
    
    while (uniqueKey.length !== 10) {
        let randomIndex = Math.floor(Math.random() * char_list.length);
        let randomChar = char_list[randomIndex];
        uniqueKey = uniqueKey + randomChar;
    }
    let ProjectKey = baseKey + uniqueKey;
    return ProjectKey;
}

FromDictToString = function(dict) {
    var ProjectMilestones = "";
    for (var key in dict) {
        var milestone = key.split(" ")[1];
        ProjectMilestones = ProjectMilestones + "," + milestone;
    }
    ProjectMilestones = ProjectMilestones.substring(1, ProjectMilestones.length);
    return ProjectMilestones;
}

function limitStringLength(inputString, maxLength) {
    if (inputString.length > maxLength) {
      return inputString.substring(0, maxLength);
    }
    return inputString;
}

function flattenArray(arr) {
    let flatArray = [];
  
    function flatten(arr) {
      for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) {
          // If the element is an array, recursively flatten it
          flatten(arr[i]);
        } else {
          // If it's not an array, push it to the flatArray
          flatArray.push(arr[i]);
        }
      }
    }
  
    flatten(arr);
    return flatArray;
  }

module.exports = {DictToEmbedList, GenerateKey, limitStringLength, PercentageOf, FromDictToString,flattenArray};