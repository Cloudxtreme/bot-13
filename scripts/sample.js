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
        //send reply
        msg.reply("hello World !");
    });

    //hear method
    robot.hear(/(\d+) smile/i, function(msg) {
        
        //access to regex matches using msg.match
        count = parseInt(msg.match[1].trim());
        
        var massage="";
        //max smile is 20
        for(var i=1;i<=count && i != 20 ;i++)
            massage+=":) ";
            
        //send final message
        msg.send(massage)
    });
};
