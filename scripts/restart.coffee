# Description:
#   Restart Hubot.
#
# Commands:
#   hubot restart

child_process = require 'child_process'
module.exports = (robot) ->
  robot.respond /RESTART$/i, (msg) ->
    msg.send "Restarting Server"
    #exit
    process.exit 0

