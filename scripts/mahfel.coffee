# Description:
#   hubot mahfel specified commands
#
# Dependencies:
#   None
#
# Configuration:
#   None
#
# Commands:
#   hubot noIdentify
#
# Author:
#   beygi

module.exports = (robot) ->
  robot.respond /noIdentify/i, (msg) ->
    msg.reply "Please identify yourself via /msg NickServ identify <password>"

