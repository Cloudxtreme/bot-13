# Description:
#   Restart Hubot.
#
# Commands:
#   hubot restart

child_process = require 'child_process'
module.exports = (robot) ->
  robot.respond /RESTART$/i, (msg) ->
    msg.send "Restarting Server"
    #reload
    process.exit 0

