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
mongo=require("../mahfel_modules/mongo.js");

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
	robot.respond(/open @?(.+) vote for @?(.+)\?*$/i, function(msg){
		vote = {}
		vote.type=msg.match[1].trim()
		console.log(msg.match[1].trim());
		if ( vote.type!='honor' && vote.type!='new' && vote.type!='fire') {
			msg.reply("valid vote types are : honor,new and fire ");
		}else if (!robot.auth.hasRole(msg.envelope.user, "prouser")) {
			msg.reply("you are not a pro user , you cant open any vote");
		}else if ( (vote.type=='honor' || vote.type=='new' || vote.type=='fire') && robot.auth.hasRole(msg.envelope.user, "prouser")) {
			vote.user=msg.match[2].trim()
			if (vote.type=='honor') {
				vote.role='prouser'
			}
			if (vote.type=='new') {
				vote.role='newuser'
			}
			if (vote.type=='fire') {
				vote.role='none'
			}
			mongo.connect(function(err){
			console.log('connected to mongo');	
			mongo.openVote(vote,function(err){
				msg.reply(err);
			})
			})
		}
		
		
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