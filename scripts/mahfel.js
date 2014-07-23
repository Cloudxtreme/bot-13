// Description:
//   hubot mahfel specified commands
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
//   hubot noIdentify
//
// Author:
//  Mahdy beygi


module.exports = function(robot) {
	robot.respond(/noIdentify/i, function(msg){
		msg.reply("Please identify yourself via /msg NickServ identify <password>");
	});
	robot.respond(/hi/i, function(msg){
		msg.reply("holla !");
	});
	robot.respond(/yo/i, function(msg){
		msg.reply("yo");
	});
	
	//register an
};
