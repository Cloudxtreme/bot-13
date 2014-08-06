// Description:
//   hubot js sample
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
//   hubot hello
//   (d) smile
//
//
//
// Author:
//  Mahdy beygi

module.exports = function(robot) {
    
    //respond method
    robot.respond(/hello/i, function(msg) {
        msg.reply("hello World !");
    });

    //hear method
    robot.hear(/(\d+) smile/i, function(msg) {
        count = parseInt(msg.match[1].trim());
        for(var i=1;i<=count;i++)
            msg.send(":) ");
    });
};
