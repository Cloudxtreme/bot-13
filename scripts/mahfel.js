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
	//open vote for honor user (all proUsers most be agree)
	
	//open vote for new user (all proUsers most be agree)
	
	//open vote for removing user (all proUsers most be agree except candidate)
	
	//register new user and give it "newUser" role
	
	/*hear for +1 and -1 for newUsers from proUsers and apply points to newUsers , also inform to channel
	and if user point is greater than 99 give it "proUser" role
	some controls most apply here : proUsers cant add or subtract more than 3 point for each newUsers per day
	*/
	
	//update info (proUsers and newUsers can update their information (email_address,name,etc))
	
	//view info (every user can view info for every user including points)
		
};