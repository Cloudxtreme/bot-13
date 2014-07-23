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
    setTimeout (->
           robot.send user, "update repository using git pull,run npm install and rerun the process ... "
           child_process.exec './restart.sh', (error, stdout, stderr) ->
              if error
                msg.send "reload failed : " + stderr           
    ), 3000

