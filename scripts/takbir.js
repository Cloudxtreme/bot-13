// Description:
//   takbir
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
//   hubot takbir
//
//
//
//
// Author:
//  Mahdy beygi

module.exports = function(robot) {
    //respond method
    robot.respond(/takbir/i, function(msg) {
        //send reply
        msg.reply("اللّه اکبر ، اللّه اکبر ، اللّه اکبر");});};