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
//   hubot hi
//   hubot yo
//   hubot open (honor|new) vote for <userName>
//   hubot show open votes
//   hubot point (+1,-1) for voteId
//   (+|-)(1|2|3) point for <user>
//
//
//
// Author:
//  Mahdy beygi
mongo=require("../mahfel_modules/mongo.js");


module.exports = function(robot) {
    robot.respond(/noIdentify/i, function(msg) {
        msg.reply("Please identify yourself via /msg NickServ identify <password>");
    });
    robot.respond(/hi/i, function(msg) {
        msg.reply("holla !");
    });
    robot.respond(/yo/i, function(msg) {
        msg.reply("yo");
    });


    //fix all ruls from mongo
    mongo.connect(function(err) {
        console.log('fetching users from mongo');
        mongo.getUsers(function(users) {
            robot.mahfel.fixRoles(users);
        });
    });

    //show open votes
    robot.respond(/show open votes/i, function(msg) {
        mongo.connect(function(err) {
            console.log('connected to mongo');
            mongo.getOpenVotes(function(votes) {
                users=robot.auth.usersWithRole('prouser');
                for(i=0;i<votes.length;i++) {
                    msg.reply(votes[i].type+" vote for "+votes[i].user+" , total votes: "+votes[i].voters.length+" from "+users.length+" , id: "+votes[i]['_id']);
                }
            });
        });
    });


    //register vote
    robot.respond(/point @?(.+) for @?([0-9a-fA-F]{24})\?*$/i, function(msg) {
        votePoint=msg.match[1].trim();
        id=msg.match[2].trim();
        if (votePoint!="+1" && votePoint!="-1") {
            msg.reply("correct values for point is : +1 and -1");
        } else if (!robot.auth.hasRole(msg.envelope.user, "prouser")) {
            msg.reply("you are not a pro user , you cant point for a vote");
        } else {
            //TODO for fire vote , the candidate user should not allow to vote

            //get vote object
            mongo.connect(function(err) {
                console.log('connected to mongo');
                mongo.getVote(id,function(vote) {
                    users=robot.auth.usersWithRole('prouser');
                    if (vote!==null) {
                        //there is an open vote object , lets register users vote and update the record

                        //push user to voters if not exist
                        if (vote.voters.indexOf(msg.envelope.user.name)==-1) {
                            vote.voters.push(msg.envelope.user.name);
                            if (votePoint=="+1") {
                                vote.totalPoint=vote.totalPoint+1;
                            } else {
                                vote.totalPoint=vote.totalPoint-1;
                            }
                            msg.reply("your point is registered for this vote");
                        } else {
                            msg.reply("sorry you cant point for a vote twice !");
                        }

                        if (users.length==vote.voters.length) {
                            if (vote.totalPoint==users.length) {
                                vote.result='accept';
                            } else {
                                vote.result='deny';
                            }
                            vote.status='close';
                            vote.totalUsers=users.length;
                            msg.reply("Okay , "+vote.type+" vote is now compeleted for "+vote.user);
                            msg.reply("total point is: "+vote.totalPoint);
                            msg.reply("result is: "+vote.result);

                            //vote type specefied process must be doing here


                            //honor vote
                            if (vote.type=='honor' && vote.result=='accept') {
                                msg.reply(vote.user+": congrats! ,"+"welcome to mahfel as a proUser");
                                //add user name to mongos user list
                                newUser={name:vote.user,role:'prouser'};
                                mongo.insertOrUpdateObject('users',newUser,'name',function(){});
                                //give it a prouser role in hubot auth system
                            }


                            //new vote
                            if (vote.type=='new' && vote.result=='accept') {
                                msg.reply(vote.user+": congrats! welcome to mahfel as a newUser , try to be a ProUser");
                                //add user name to mongos user list
                                newUser={name:vote.user,role:'newuser',points:0};
                                mongo.insertOrUpdateObject('users',newUser,'name',function(){});
                                //give it a newuser role in hubot auth system
                            }


                            //TODO
                            //fire vote
                            if (vote.type=='fire' && vote.result=='accept') {
                                msg.reply(vote.user+": sorry! you are not a mahfel user anymore");
                                //remove user name to mongos user list

                                //rempve prouser and newuser role in hubot auth system

                                //remove user access to server
                            }

                        }

                        mongo.updateVote(vote,function(err) {
                            console.log('vote updated in mongodb');
                            //renew all roles in mongo
                            mongo.getUsers(function(users) {
                                robot.mahfel.fixRoles(users);
                            });
                        });

                        //
                    } else {
                        msg.reply("no vote exists for this id");
                    }

                });
            });
        }
    }
    );

    //open new vote
    //open vote for honor user (all proUsers most be agree)
    //open vote for new user (all proUsers most be agree)
    //open vote for removing user (all proUsers most be agree except candidate)

    robot.respond(/open @?(.+) vote for @?(.+)\?*$/i, function(msg) {
        vote = {};
        vote.type=msg.match[1].trim();
        console.log(msg.match[1].trim());
        if ( vote.type!='honor' && vote.type!='new' && vote.type!='fire') {
            msg.reply("valid vote types are : honor,new and fire ");
        } else if (!robot.auth.hasRole(msg.envelope.user, "prouser")) {
            msg.reply("you are not a pro user , you cant open any vote");
        } else if ( (vote.type=='honor' || vote.type=='new' || vote.type=='fire') && robot.auth.hasRole(msg.envelope.user, "prouser")) {
            vote.user=msg.match[2].trim();
            if (vote.type=='honor') {
                vote.role='prouser';
            }
            if (vote.type=='new') {
                vote.role='newuser';
            }
            if (vote.type=='fire') {
                vote.role='none';
            }
            mongo.connect(function(err) {
                console.log('connected to mongo');
                mongo.openVote(vote,function(err) {
                    msg.reply(err);
                });
            });
        }


    });


    /*hear for +1 and -1 for newUsers from proUsers and apply points to newUsers , also inform to channel
      and if user point is greater than 99 give it "proUser" role
      some controls most apply here : proUsers cant add or subtract more than 3 point for each newUsers per day
      */
    robot.hear(/([\+,-])(\d+) for (\w+)/i, function(msg) {
        sign = msg.match[1].trim();
        point = msg.match[2].trim();
        userName = msg.match[3].trim();
        if (robot.auth.hasRole(msg.envelope.user, "prouser")) {
            mongo.connect(function(err) {
                console.log('connected to mongo');
                mongo.getUser(userName,function(mongoUser) {
                    if (mongoUser !== null && mongoUser.role == 'newuser') {
                        if(point<=3 && point>=1) {
                            if (sign=='+') {
                                mongoUser.points=parseInt(mongoUser.points)+parseInt(point);
                            }
                            if (sign=='-') {
                                mongoUser.points=parseInt(mongoUser.points)-parseInt(point);
                            }
                            msg.send(sign+point+" for "+userName+"! , total point: "+mongoUser.points);
                            if (mongoUser.points>=100) {
                                //user is a proUser Now
                                msg.send(userName+": congrats! ,"+"welcome to mahfel as a proUser");
                                //add user name to mongos user list
                                mongoUser.role='prouser';
                                delete mongoUser['_id'];
                                mongo.insertOrUpdateObject('users',mongoUser,'name',function() {
                                    //give it a prouser role in hubot auth system
                                    mongo.getUsers(function(users) {
                                        robot.mahfel.fixRoles(users);
                                    });
                                });
                            } else {
                                delete mongoUser['_id'];
                                mongo.insertOrUpdateObject('users',mongoUser,'name',function() {
                                });
                            }
                        }
                    }
                });
            });
        }
    });

    // update info (proUsers and newUsers can update their information (email_address,name,etc)
    // should add validation for email, twitter, etc.
    // email -> (.[^@\s]*@+.[^\s]+))

    robot.hear(/update my (\w+) (.[^\s]+)/i, function(msg) {
        console.log(JSON.stringify(msg.match,null,4));
        var property = msg.match[1];
        var value = msg.match[2];
        var username = msg.envelope.user.name;
        var vaildProperties = ["email", "github", "twitter", "feed", "description"];
        if (robot.auth.hasRole(msg.envelope.user, "prouser")) {
            console.log("[DEBUG] ", username, " is prouser." );
            console.log("[DEBUG] validProperties", typeof validProperties);
            console.log(validProperties);
            console.log(validProperties.indexOf(property));
            if (validProperties.indexOf(property) > -1){
                console.log("[DEBUG] ", property, " is valid." );
                mongo.connect(function(err) {
                    console.log("[DEBUG] connected to mongo");
                    mongo.getUser(username, function(user){
                        console.log("[DEBUG] user in our databse: ", user);
                        user.email = email;
                        mongo.insertOrUpdateObject('users', user, function() {
                            msg.send(username +"'s email changed to ", email);
                        });
                    });
                });
            } else {
                console.log(property + " is not a valid property");
            }
        }
    });
};
