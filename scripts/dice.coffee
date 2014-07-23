# Description:
#   Roll dice!
#
# Dependencies:
#   None
#
# Configuration:
#   None
#
# Commands:
#   hubot roll a die - Gives you 1-6
#   hubot roll <number> die - Gives you 1-6
#
# Author:
#   Omid

module.exports = (robot) ->
  robot.respond /roll (a|\d+) die/i, (msg) ->
    match = msg.match[1]
    num = if match == "a" then 1 else parseInt(match)
    a = ((Math.floor(Math.random() * 6) + 1) for _ in [1..num])
    msg.reply a.join(", ")
